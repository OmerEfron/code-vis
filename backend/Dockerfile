# Dockerfile for backend service (monorepo-aware)
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# 1. Copy only backend package manifests first to leverage Docker layer caching
COPY backend/package.json backend/package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# 2. Copy backend source code
COPY backend/src ./src

# 3. Copy shared JSON schemas so the app can load them at runtime
COPY schemas /schemas

# ---------------------------
# Final lightweight image
FROM node:18-alpine
WORKDIR /app

# Copy application code and dependencies from builder
COPY --from=builder /app .
COPY --from=builder /schemas /schemas

EXPOSE 3000

CMD ["node", "src/server.js"] 