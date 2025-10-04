FROM node:18-alpine AS base

WORKDIR /usr/src/app

# Install deps separately for better caching
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/index.js"]