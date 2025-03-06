# Metrics Microservice

A robust, scalable metrics collection and reporting service built with NestJS, gRPC, and TypeScript.

## Overview

The Metrics microservice is responsible for collecting, storing, and reporting metrics from various services within the Jackpot platform. It follows clean architecture principles, functional programming patterns, and maintains type safety throughout the codebase.

## Architecture

The service is structured following clean architecture principles:

### Domain Layer
- **MetricsProcessor**: Processes and validates incoming metrics
- **MetricsValidator**: Validates metrics requests using Zod
- **ReportGenerator**: Generates detailed and summary reports

### Infrastructure Layer
- **MetricsRepository**: Database interactions with TypeORM
- **Redis Caching Service**: Implements caching strategies
- **Metrics Entity**: Database schema for metrics storage

### Controller and Service
- **MetricsController**: Handles gRPC requests
- **MetricsService**: Orchestrates domain and infrastructure services

## Features

- **Metrics Collection**: Collect metrics from various sources with validation
- **Metrics Retrieval**: Retrieve metrics with flexible filtering options
- **Report Generation**: Generate detailed and summary reports in various formats (JSON, CSV)
- **Health Monitoring**: Comprehensive health checks for database and Redis connectivity
- **Caching**: Redis-based caching for improved performance

## API Endpoints

### gRPC Methods

- `collectMetrics`: Collect and store new metrics
- `getMetrics`: Retrieve metrics with filtering options
- `getMetricById`: Retrieve a specific metric by ID
- `generateReport`: Generate reports based on collected metrics
- `checkHealth`: Check the health of the service and its dependencies

## Configuration

The service can be configured using environment variables:

- `GRPC_PORT`: gRPC server port (default: 5002)
- `HTTP_PORT`: HTTP server port (default: 3002)
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)
- `DATABASE_HOST`: Database host
- `DATABASE_PORT`: Database port
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_NAME`: Database name

## Development

### Prerequisites

- Bun 1.0+
- Node.js 18+
- Docker and Docker Compose (for local development)

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Run the service:
   ```
   bun run start:metrics
   ```

### Testing

Run the unit tests:
```
bun run test:metrics
```

Run the e2e tests:
```
bun run test:e2e:metrics
```

## Deployment

The service is deployed using Kubernetes. The deployment configuration can be found in `infra/k8s/metrics-deployment.yaml`.

### Docker

Build the Docker image:
```
docker build -t jackpot/metrics:latest -f apps/metrics/Dockerfile .
```

Run the Docker container:
```
docker run -p 5002:5002 -p 3002:3002 jackpot/metrics:latest
```

## CI/CD

The service is built, tested, and deployed using GitLab CI/CD. The pipeline configuration can be found in `.gitlab-ci.yml`.

## Best Practices

This service follows these best practices:

- **Functional Programming**: Emphasizes immutability and pure functions
- **Type Safety**: Comprehensive TypeScript types and interfaces
- **Clean Architecture**: Separation of concerns with domain-driven design
- **Error Handling**: Comprehensive error handling with proper error messages
- **Validation**: Input validation using Zod
- **Caching**: Efficient caching strategies with Redis
- **Health Checks**: Comprehensive health checks for all dependencies
- **Kubernetes-Ready**: Designed to run in Kubernetes with proper health probes

## Future Improvements

- Implement more advanced caching strategies
- Add more detailed metrics aggregation
- Implement rate limiting
- Add more comprehensive logging
- Implement more advanced security measures
