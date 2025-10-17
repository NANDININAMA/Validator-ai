# Multi-stage build for production
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY Backend/package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend_original/package*.json ./
RUN npm ci
COPY frontend_original/ ./
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Copy backend
COPY Backend/ ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 5002

# Start backend server
CMD ["node", "backend/server.js"]