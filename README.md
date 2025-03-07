# Jackpot Microservices Platform

A comprehensive B2B backend platform built with modern technologies including Turborepo, Bun, NestJS, and gRPC.

## 🚀 Architecture

This monorepo follows Clean Architecture principles and is built with a microservices approach. It contains the following services:

- **Admin Service**: User management, authentication, and system administration
- **Metrics Service**: Metrics collection, analysis, and reporting
- **Scheduler Service**: Job scheduling and execution
- **Gateway Service**: API gateway for external communication
- **Engine Service**: Core business logic processing

The services communicate with each other using gRPC, and the entire monorepo is managed with Turborepo for efficient builds and dependency management.

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.2.0 or later
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for local infrastructure)
- [Node.js](https://nodejs.org/) v18 or later (optional, as Bun includes Node.js compatibility)

## 🛠️ Getting Started

### Setting Up the Development Environment

1. **Clone the repository**

```bash
git clone https://gitlab.gosystem.io/jackpot/monorepo.git
cd monorepo
```

2. **Run the setup script**

This script will create the necessary environment files and set up your development environment:

```bash
chmod +x setup-dev-env.sh
./setup-dev-env.sh
```

3. **Start the infrastructure services**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. **Start the development server**

```bash
bun run dev
```

This will start all microservices in development mode with hot-reloading enabled.

### Running Services

You can run all services or target specific ones using Turborepo:

```bash
# Run all services in development mode
bun run dev

# Run only app services in development mode
bun run dev:app

# Run a specific service in development mode
bun run dev:scope @jackpot/scheduler
```

You can also run services individually from their directories:

```bash
# Admin Service
cd apps/admin && bun run dev

# Metrics Service
cd apps/metrics && bun run dev

# Scheduler Service
cd apps/scheduler && bun run dev

# Gateway Service
cd apps/gateway && bun run dev

# Engine Service
cd apps/engine && bun run dev
```

## 🧪 Testing

### Running Tests

The monorepo provides various testing commands using Turborepo for efficient execution:

```bash
# Run all tests across the monorepo
bun run test

# Run tests only for apps
bun run test:app

# Run tests only for packages
bun run test:pkg

# Run tests for a specific app or package
bun run test:scope @jackpot/scheduler

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch

# Run integration tests
bun run test:integration

# Run integration tests for a specific app
bun run test:integration:scope @jackpot/scheduler

# Run end-to-end tests
bun run test:e2e
```

### Testing Utilities

The monorepo includes a shared testing utilities package `@jackpot/testing-utils` that provides:

- gRPC testing utilities (mock servers and clients)
- Redis mocking utilities
- Database testing utilities
- Test module builder
- Test fixtures

### Testing Best Practices

- **Unit Tests**: Test individual components in isolation with proper mocking
- **Integration Tests**: Test the interaction between components
  - Use `createMockGrpcServer` from `@jackpot/testing-utils` to mock gRPC services
  - Use `MockRedisModule.forTest()` to mock Redis connections
- **Test Configuration**: 
  - Each service has its own `jest.config.js` file
  - Remove Jest configuration from `package.json` to avoid conflicts
  - Set `NODE_ENV=test` in test environments
- **Mock Implementation**: 
  - Create proper mock implementations for external services
  - Override providers in test modules using `.overrideProvider()` and `.useFactory()`
  - Implement error handling in service methods to gracefully handle test scenarios

See the `TESTING.md` document for detailed testing strategy and best practices.

## 🔧 Environment Configuration

Each service has its own `.env` file for configuration. The setup script creates these files from the `.env.example` templates.

Key environment variables:

- `NODE_ENV`: Environment (development, production)
- `HTTP_PORT`: HTTP server port
- `GRPC_PORT`: gRPC server port
- `DATABASE_*`: Database connection settings
- `REDIS_*`: Redis connection settings
- `JWT_*`: JWT authentication settings

## 📦 Project Structure

```
jackpot-bootstrap-monorepo/
├── apps/                   # Microservices
│   ├── admin/              # Admin service
│   ├── metrics/            # Metrics service
│   ├── scheduler/          # Scheduler service
│   ├── gateway/            # API Gateway service
│   └── engine/             # Engine service
├── packages/               # Shared packages
│   └── testing-utils/      # Testing utilities package
├── protos/                 # Protocol Buffer definitions
│   ├── admin.proto         # Admin service definitions
│   ├── metrics.proto       # Metrics service definitions
│   ├── scheduler.proto     # Scheduler service definitions
│   ├── gateway.proto       # Gateway service definitions
│   ├── engine.proto        # Engine service definitions
│   └── common.proto        # Shared message types
├── scripts/                # Utility scripts
│   ├── generate-proto.js   # Proto generation script
│   ├── setup-dependencies.js # Dependencies setup script
│   └── validate-env.js     # Environment validation script
├── docker/                 # Docker configuration
│   └── mysql/
│       └── init/           # MySQL initialization scripts
├── package.json            # Root package.json
├── turbo.json              # Turborepo configuration
├── docker-compose.dev.yml  # Development infrastructure
├── TESTING.md              # Testing strategy documentation
└── setup-dev.env.sh        # Development setup script
```

## 🔄 Development Workflow

1. **Feature Development**
   - Create a feature branch from `main`
   - Implement your changes
   - Write tests for your changes
   - Submit a merge request

2. **Code Quality**
   - Run linting: `bun run lint` or `bun run lint:scope @jackpot/scheduler`
   - Run tests: `bun run test` or `bun run test:scope @jackpot/scheduler`
   - Ensure all checks pass before submitting MR

3. **Building for Production**
   - Run `bun run build` to build all services
   - Build specific services: `bun run build:scope @jackpot/scheduler`
   - Production artifacts will be in the `dist` directory of each service

4. **Working with Protocol Buffers**
   - Proto files are located in the `/protos` directory at the root of the monorepo
   - Generate TypeScript interfaces: `bun run generate:proto`
   - Generate for specific service: `bun run generate:proto:scope @jackpot/scheduler`
   - When configuring gRPC clients, use the correct path to proto files with appropriate parent directory references

## 🔒 Security

- All sensitive information should be stored in environment variables
- JWT tokens are used for authentication
- Role-based access control is implemented in the Admin service
- API rate limiting is configured in the Gateway service

## 📚 API Documentation

### REST API Documentation

The REST API documentation is generated using Swagger/OpenAPI and is available through the Gateway service when running in development mode:

```bash
# Start the Gateway service
bun run dev:scope @jackpot/gateway
```

Then access the Swagger UI at: http://localhost:3000/api/docs

### Generating API Documentation

The API documentation is automatically generated using NestJS Swagger. To ensure your endpoints are properly documented:

1. Add `@ApiTags()` decorator to your controllers
2. Add `@ApiOperation()` decorator to describe each endpoint
3. Add `@ApiResponse()` decorators to document possible responses
4. Use `@ApiProperty()` in your DTOs to document request/response properties

### gRPC API Documentation

For gRPC services, the API is defined in Protocol Buffer files located in the `protos` directory at the root of the monorepo.

## 🤝 Contributing

1. Clone the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a merge request on GitLab

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
