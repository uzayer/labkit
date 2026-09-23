# STALE / UNSUPPORTED: this file is not part of any working deployment path.
# It remains as a historical starting point and should not be assumed to work.
# Bun installs the dependency tree; Node runs build and production processes.
FROM oven/bun:1.4.2-alpine AS dependencies

WORKDIR /app

# Keep dependency installation cacheable and reproducible.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_STATIC_GENERATION=true
# Payload validates its signing key while generating types. This value exists
# only in the disposable builder stage; docker-compose supplies the real key.
ENV PAYLOAD_SECRET=build-only-payload-signing-key-override-at-runtime

RUN node ./node_modules/payload/bin.js generate:types && node ./node_modules/next/dist/bin/next build

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# Next's standalone trace does not preserve every dependency edge Payload uses
# at runtime, so retain the Bun-resolved dependency tree from the builder.
COPY --from=builder /app/node_modules ./node_modules

# Next.js output tracing supplies the built application files.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
