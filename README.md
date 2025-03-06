# Jackpot Microservices Platform

A comprehensive B2B backend platform built with modern technologies including Turborepo, Bun, NestJS, and gRPC.

## 🚀 Architecture

This monorepo contains the following microservices:

- **Admin Service**: User management, authentication, and system administration
- **Metrics Service**: Metrics collection, analysis, and reporting
- **Scheduler Service**: Job scheduling and execution
- **Gateway Service**: API gateway for external communication
- **Engine Service**: Core business logic processing

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.2.0 or later
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for local infrastructure)
- [Node.js](https://nodejs.org/) v18 or later (optional, as Bun includes Node.js compatibility)

## 🛠️ Getting Started

### Setting Up the Development Environment

1. **Clone the repository**

```bash
git clone https://github.com/your-organization/jackpot-bootstrap-monorepo.git
cd jackpot-bootstrap-monorepo
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

### Running Individual Services

You can also run services individually:

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

Run tests across all services:

```bash
bun run test
```

Or test individual services:

```bash
cd apps/admin && bun run test
```

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
├── protos/                 # Protocol Buffer definitions
│   ├── admin.proto         # Admin service definitions
│   ├── metrics.proto       # Metrics service definitions
│   ├── scheduler.proto     # Scheduler service definitions
│   ├── gateway.proto       # Gateway service definitions
│   ├── engine.proto        # Engine service definitions
│   └── common.proto        # Shared message types
├── docker/                 # Docker configuration
│   └── mysql/
│       └── init/           # MySQL initialization scripts
├── package.json            # Root package.json
├── turbo.json              # Turborepo configuration
├── docker-compose.dev.yml  # Development infrastructure
└── setup-dev.env.sh        # Development setup script
```

## 🔄 Development Workflow

1. **Feature Development**
   - Create a feature branch from `main`
   - Implement your changes
   - Write tests for your changes
   - Submit a pull request

2. **Code Quality**
   - Run linting: `bun run lint`
   - Run tests: `bun run test`
   - Ensure all checks pass before submitting PR

3. **Building for Production**
   - Run `bun run build` to build all services
   - Production artifacts will be in the `dist` directory of each service

## 🔒 Security

- All sensitive information should be stored in environment variables
- JWT tokens are used for authentication
- Role-based access control is implemented in the Admin service
- API rate limiting is configured in the Gateway service

## 📚 API Documentation

The API documentation is available through the Gateway service when running in development mode:

- REST API: http://localhost:3000/api/docs
- gRPC: Protocol Buffer definitions in the `protos` directory

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
