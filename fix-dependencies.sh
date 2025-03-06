#!/bin/bash

# Fix Dependency Injection Errors Script
# This script fixes common dependency injection errors in the microservices
# by ensuring all required environment variables are set correctly.

echo "🔧 Fixing dependency injection errors in microservices"
echo "======================================================"

# Create directory for Redis module in admin service if it doesn't exist
mkdir -p apps/admin/src/infrastructure/redis

# Update environment files with correct values
echo "📝 Updating environment files..."

# Update admin service .env file
if [ -f apps/admin/.env ]; then
  # Check if REDIS_CLIENT configuration is present
  if ! grep -q "REDIS_PREFIX" apps/admin/.env; then
    echo "Adding Redis configuration to admin service .env file"
    cat << EOF >> apps/admin/.env

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_PREFIX=admin:
REDIS_CACHE_TTL=300
EOF
  fi
fi

# Update scheduler service .env file
if [ -f apps/scheduler/.env ]; then
  # Check if METRICS_SERVICE_URL is correctly formatted
  if ! grep -q "GRPC_MAX_SEND_MESSAGE_LENGTH" apps/scheduler/.env; then
    echo "Adding gRPC client configuration to scheduler service .env file"
    cat << EOF >> apps/scheduler/.env

# gRPC Client Configuration
GRPC_MAX_SEND_MESSAGE_LENGTH=4194304
GRPC_MAX_RECEIVE_MESSAGE_LENGTH=4194304
EOF
  fi
fi

# Make sure all the new modules are in place
echo "🔍 Checking for required modules..."

# Check if Redis module exists in admin service
if [ ! -f apps/admin/src/infrastructure/redis/redis.module.ts ]; then
  echo "Creating Redis module in admin service"
  cat << 'EOF' > apps/admin/src/infrastructure/redis/redis.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost')
        const redisPort = configService.get<number>('REDIS_PORT', 6379)
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '')
        const redisPrefix = configService.get<string>('REDIS_PREFIX', 'admin:')
        
        const options: Redis.RedisOptions = {
          host: redisHost,
          port: redisPort,
          keyPrefix: redisPrefix,
        }
        
        if (redisPassword) {
          options.password = redisPassword
        }
        
        return new Redis(options)
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
EOF
fi

# Check if gRPC module exists in scheduler service
if [ ! -d apps/scheduler/src/infrastructure/grpc ]; then
  echo "Creating gRPC module directory in scheduler service"
  mkdir -p apps/scheduler/src/infrastructure/grpc
fi

if [ ! -f apps/scheduler/src/infrastructure/grpc/grpc.module.ts ]; then
  echo "Creating gRPC module in scheduler service"
  cat << 'EOF' > apps/scheduler/src/infrastructure/grpc/grpc.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'METRICS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('METRICS_SERVICE_URL'),
            package: 'metrics',
            protoPath: join(__dirname, '../../../../protos/metrics.proto'),
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
EOF
fi

# Update the scheduler domain module to import the GrpcModule
if [ -f apps/scheduler/src/domain/scheduler-domain.module.ts ]; then
  if ! grep -q "GrpcModule" apps/scheduler/src/domain/scheduler-domain.module.ts; then
    echo "Updating scheduler domain module to import GrpcModule"
    sed -i '' 's/import { SchedulerInfrastructureModule } from ..\\/infrastructure\\/scheduler-infrastructure.module./import { SchedulerInfrastructureModule } from ..\\/infrastructure\\/scheduler-infrastructure.module.\\nimport { GrpcModule } from ..\\/infrastructure\\/grpc\\/grpc.module./g' apps/scheduler/src/domain/scheduler-domain.module.ts
    sed -i '' 's/imports: \[SchedulerInfrastructureModule\],/imports: \[SchedulerInfrastructureModule, GrpcModule\],/g' apps/scheduler/src/domain/scheduler-domain.module.ts
  fi
fi

# Update the admin health module to import the RedisModule
if [ -f apps/admin/src/health/health.module.ts ]; then
  if ! grep -q "RedisModule" apps/admin/src/health/health.module.ts; then
    echo "Updating admin health module to import RedisModule"
    sed -i '' 's/import { TypeOrmModule } from .@nestjs\\/typeorm./import { TypeOrmModule } from .@nestjs\\/typeorm.\\nimport { RedisModule } from ..\\/infrastructure\\/redis\\/redis.module./g' apps/admin/src/health/health.module.ts
    sed -i '' 's/TypeOrmModule/TypeOrmModule,\\n\\t\\tRedisModule/g' apps/admin/src/health/health.module.ts
  fi
fi

echo "✅ Dependency fixes applied"
echo ""
echo "🔄 Restart your services with: bun run dev"
echo ""
echo "If you still encounter errors, you may need to manually update your .env files"
echo "with the correct values from the .env.example files."
