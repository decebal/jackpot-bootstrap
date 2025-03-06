FROM oven/bun:1.0 as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/metrics/package.json ./apps/metrics/
COPY protos ./protos

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/metrics ./apps/metrics
COPY tsconfig.json ./

# Build the application
RUN bun run build --filter=metrics

# Production stage
FROM oven/bun:1.0-slim

WORKDIR /app

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/metrics/dist ./apps/metrics/dist
COPY --from=builder /app/apps/metrics/package.json ./apps/metrics/
COPY --from=builder /app/protos ./protos

# Set environment variables
ENV NODE_ENV=production
ENV GRPC_PORT=5002
ENV HTTP_PORT=3002

# Expose ports
EXPOSE 5002 3002

# Set the command to run the application
CMD ["bun", "run", "apps/metrics/dist/main.js"]
