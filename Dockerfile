# Multi-stage Dockerfile for Next.js Anniversary Calendar
# Based on Next.js official Docker example with optimizations

# Stage 1: Dependencies
FROM node:20 AS deps
# 设置 npm 镜像源为淘宝源，加速下载
RUN npm config set registry https://registry.npmmirror.com/
# 直接安装 pnpm，不依赖 corepack 的网络查询
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20 AS builder
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client
RUN pnpm prisma generate

# Build Next.js application
RUN pnpm build

# Stage 3: Runner
FROM node:20 AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files for migrations
COPY --from=builder /app/prisma ./prisma

# Create uploads directory for images
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# NOTE: We originally switched to a non-root user (`nextjs`) for security,
# but this caused permission issues when writing to the mounted uploads volume.
# For now, run as root to ensure the app can write to /app/public/uploads.
USER root

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
