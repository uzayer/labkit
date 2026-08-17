FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS dependencies

WORKDIR /home/node/app

# Keep dependency installation cacheable and reproducible.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /home/node/app

COPY --from=dependencies /home/node/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_STATIC_GENERATION=true
# Payload validates its signing key while generating types. This value exists
# only in the disposable builder stage; docker-compose supplies the real key.
ENV PAYLOAD_SECRET=build-only-payload-signing-key-override-at-runtime

RUN pnpm build

FROM base AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /home/node/app

# Install the locked production dependency set. Next's standalone trace does
# not preserve every pnpm virtual-store edge used by Payload at runtime.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# The root prepare script invokes Husky, which is intentionally absent from
# production dependencies.
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Next.js output tracing supplies the built application files.
COPY --from=builder --chown=node:node /home/node/app/public ./public
COPY --from=builder --chown=node:node /home/node/app/.next/standalone ./
COPY --from=builder --chown=node:node /home/node/app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
