# Build stage: compile the Vite app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Runtime stage: serve with Nginx
FROM nginx:alpine AS runner
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Add custom Nginx config to proxy /api to backend service
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]