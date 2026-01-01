# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY package.json pnpm-workspace.yaml ./
COPY apps/api ./apps/api
COPY apps/web ./apps/web
RUN pnpm --filter @todo-app/web build
RUN pnpm --filter @todo-app/api build
RUN mkdir -p apps/api/dist/public && \
    cp -r apps/web/dist/* apps/api/dist/public/ && \
    mkdir -p apps/api/dist/drizzle && \
    cp -r apps/api/drizzle/* apps/api/dist/drizzle/

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
# Production deps only
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
RUN chown -R nestjs:nodejs /app
USER nestjs
WORKDIR /app/apps/api
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "dist/main"]
