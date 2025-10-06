FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
# Install only production dependencies for runtime
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4001
CMD ["node", "dist/index.js"]