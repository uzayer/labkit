FROM oven/bun:1.3.14-alpine AS base

FROM base AS dependencies

WORKDIR /home/bun/app

# Keep dependency installation cacheable and reproducible.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

FROM base AS builder

WORKDIR /home/bun/app

COPY --from=dependencies /home/bun/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_STATIC_GENERATION=true
# Payload validates its signing key while generating types. This value exists
# only in the disposable builder stage; docker-compose supplies the real key.
ENV PAYLOAD_SECRET=build-only-payload-signing-key-override-at-runtime

RUN bun run build

FROM base AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /home/bun/app

# Install the locked production dependency set. Next's standalone trace does
# not preserve every Bun dependency edge used by Payload at runtime.
COPY package.json bun.lock bunfig.toml ./
# The root prepare script invokes Husky, which is intentionally absent from
# production dependencies.
RUN bun install --production --frozen-lockfile --ignore-scripts

# Next.js output tracing supplies the built application files.
COPY --from=builder --chown=bun:bun /home/bun/app/public ./public
COPY --from=builder --chown=bun:bun /home/bun/app/.next/standalone ./
COPY --from=builder --chown=bun:bun /home/bun/app/.next/static ./.next/static

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD ["bun", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["bun", "server.js"]
