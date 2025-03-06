#!/bin/bash

# Setup Development Environment Script
# This script sets up the local development environment by:
# 1. Creating .env files from .env.example files
# 2. Setting up Docker services if needed
# 3. Initializing the development environment

echo "🚀 Setting up Jackpot Microservices Development Environment"
echo "=========================================================="

# Create root .env file
if [ ! -f .env ]; then
  echo "📝 Creating root .env file..."
  cp .env.example .env
  echo "✅ Root .env file created"
else
  echo "ℹ️ Root .env file already exists"
fi

# Create .env files for each microservice
SERVICES=("admin" "metrics" "scheduler" "gateway" "engine")

for service in "${SERVICES[@]}"; do
  if [ ! -f "apps/$service/.env" ]; then
    echo "📝 Creating .env file for $service service..."
    cp "apps/$service/.env.example" "apps/$service/.env"
    echo "✅ .env file for $service service created"
  else
    echo "ℹ️ .env file for $service service already exists"
  fi
done

# Check for required dependencies
echo "🔍 Checking for required dependencies..."

# Check for Bun
if ! command -v bun &> /dev/null; then
  echo "❌ Bun is not installed. Please install Bun v1.2.0 or later."
  echo "   You can install it by running: curl -fsSL https://bun.sh/install | bash"
  exit 1
else
  BUN_VERSION=$(bun --version)
  echo "✅ Bun v$BUN_VERSION is installed"
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo "⚠️ Docker is not installed. You may need it for database and Redis services."
  echo "   You can install it from https://docs.docker.com/get-docker/"
else
  echo "✅ Docker is installed"
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
  echo "⚠️ Docker Compose is not installed. You may need it for running services."
  echo "   You can install it from https://docs.docker.com/compose/install/"
else
  echo "✅ Docker Compose is installed"
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install
echo "✅ Dependencies installed"

# Setup dependencies
echo "🔧 Setting up dependencies..."
bun run setup:deps
echo "✅ Dependencies setup complete"

# Validate environment variables
echo "🔍 Validating environment variables..."
bun run validate:env
if [ $? -ne 0 ]; then
  echo "❌ Environment validation failed. Please check the error messages above."
  exit 1
fi
echo "✅ Environment validation passed"

# Build the project
echo "🔨 Building the project..."
bun run build
echo "✅ Project built successfully"

echo "🎉 Development environment setup complete!"
echo "You can now start the development server with: bun run dev"
echo ""
echo "📋 Available commands:"
echo "  - bun run dev: Start all services in development mode"
echo "  - bun run build: Build all services"
echo "  - bun run lint: Lint all services"
echo "  - bun run test: Run tests for all services"
echo "  - bun run clean: Clean build artifacts"
echo ""
echo "🔧 To start individual services:"
echo "  - cd apps/admin && bun run dev"
echo "  - cd apps/metrics && bun run dev"
echo "  - cd apps/scheduler && bun run dev"
echo "  - cd apps/gateway && bun run dev"
echo "  - cd apps/engine && bun run dev"
