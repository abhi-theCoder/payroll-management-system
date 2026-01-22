# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Skip puppeteer download during build to save time and memory
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files explicitly
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Install Puppeteer dependencies for Alpine
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Tell Puppeteer where to find Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production

WORKDIR /app

# Copy package files from builder
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
