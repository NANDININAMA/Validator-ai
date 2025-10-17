# Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB
- Git

## Environment Setup
1. Copy `.env.example` to `Backend/.env`
2. Update environment variables with your production values

## Local Development
```bash
npm run install:all
npm run dev
```

## Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Manual Deployment
```bash
# Install dependencies
npm run install:all

# Build frontend
cd frontend_original && npm run build

# Start production server
cd ../Backend && npm start
```

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5002)
- `NODE_ENV`: Environment (development/production)

## Deployment Platforms
- **Heroku**: Use `Procfile` and set environment variables
- **Railway**: Connect GitHub repo and set environment variables
- **DigitalOcean**: Use Docker deployment
- **AWS**: Use ECS or EC2 with Docker