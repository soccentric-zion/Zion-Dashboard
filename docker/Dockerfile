# syntax=docker/dockerfile:1
# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps
#   Install production + dev dependencies so the build cache is reused when
#   only source files change.
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY webui/package.json webui/package-lock.json* ./

RUN npm ci --ignore-scripts

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 — builder
#   Compile the Next.js app.
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY webui/ .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3 — runner
#   Minimal production image — only the standalone Next.js output.
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3010

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs

EXPOSE 3010

CMD ["node", "server.js"]
