# Testing Strategy for Jackpot Monorepo

This document outlines the testing strategy for the Jackpot monorepo, which consists of multiple microservices (admin, scheduler, metrics, gateway, engine) that communicate with each other via gRPC.

## Testing Approach

Our testing approach follows a multi-layered strategy:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test interactions between components within a service
3. **Service Integration Tests**: Test interactions between microservices

## Testing Infrastructure

We've established a shared testing infrastructure to ensure consistent testing across all microservices:

- **Testing Utilities Package**: `@jackpot/testing-utils` provides common testing utilities for all services
- **Mock Services**: Mock implementations of services to isolate and test specific interactions
- **Test Fixtures**: Common test data and utilities for testing

## Running Tests

### Unit Tests

Run unit tests for all services:

```bash
bun run test
```

Run unit tests for a specific service:

```bash
cd apps/scheduler
bun run test
```

### Integration Tests

Run integration tests for all services:

```bash
bun run test:integration
```

Run integration tests for a specific service:

```bash
cd apps/scheduler
bun run test:integration
```

## Testing Utilities

### gRPC Testing

The `@jackpot/testing-utils` package provides utilities for testing gRPC services:

- `createGrpcTestClient`: Creates a gRPC client for testing
- `createMockGrpcServer`: Creates a mock gRPC server for testing

Example:

```typescript
import { createGrpcTestClient, createMockGrpcServer } from '@jackpot/testing-utils';

// Create a mock gRPC server
const mockServer = createMockGrpcServer(
  'protos/engine.proto',
  'engine',
  'EngineService',
  {
    processJob: (call, callback) => {
      callback(null, { success: true });
    },
  }
);

// Start the server
await mockServer.start();

// Create a client to test against the mock server
const client = createGrpcTestClient(
  'protos/engine.proto',
  'engine',
  'EngineService'
);

// Test the client
const result = await client.processJob({ jobId: 'test' });
expect(result.success).toBe(true);

// Stop the server
await mockServer.stop();
```

### Redis Testing

The `@jackpot/testing-utils` package provides utilities for testing Redis:

- `MockRedisModule`: NestJS module that provides a mock Redis client
- `createRedisClientSpy`: Creates a Redis client spy for testing

Example:

```typescript
import { Test } from '@nestjs/testing';
import { MockRedisModule, createRedisClientSpy } from '@jackpot/testing-utils';
import { REDIS_CLIENT } from './redis.module';

// Create a test module with a mock Redis client
const redisClientSpy = createRedisClientSpy();
const moduleRef = await Test.createTestingModule({
  imports: [YourModule],
})
  .overrideProvider(REDIS_CLIENT)
  .useValue(redisClientSpy)
  .compile();

// Test Redis interactions
redisClientSpy.get.mockResolvedValue('test-value');
const service = moduleRef.get(YourService);
const result = await service.getValue('test-key');
expect(result).toBe('test-value');
expect(redisClientSpy.get).toHaveBeenCalledWith('test-key');
```

### Database Testing

The `@jackpot/testing-utils` package provides utilities for testing databases:

- `createTestDatabaseConfig`: Creates a TypeORM configuration for in-memory SQLite database
- `createMySqlTestConfig`: Creates a TypeORM configuration for testing with MySQL
- `clearDatabase`: Clears all tables in the database

Example:

```typescript
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestDatabaseConfig } from '@jackpot/testing-utils';
import { YourEntity } from './your-entity';

// Create a test module with an in-memory database
const moduleRef = await Test.createTestingModule({
  imports: [
    TypeOrmModule.forRoot(createTestDatabaseConfig([YourEntity])),
    TypeOrmModule.forFeature([YourEntity]),
    YourModule,
  ],
}).compile();

// Test database interactions
const service = moduleRef.get(YourService);
const result = await service.create({ name: 'test' });
expect(result.name).toBe('test');
```

## CI/CD Integration

Our CI/CD pipeline is monorepo-aware and runs tests selectively based on changes:

- **Selective Testing**: Only runs tests for services affected by changes
- **Parallel Testing**: Runs tests for different services in parallel
- **Integration Testing**: Runs integration tests for all services affected by changes

The pipeline is configured in `.gitlab-ci.yml`.

## Best Practices

1. **Isolation**: Tests should be isolated and not depend on external services
2. **Deterministic**: Tests should be deterministic and not rely on external state
3. **Fast**: Tests should be fast to run to enable quick feedback
4. **Comprehensive**: Tests should cover all critical paths and edge cases
5. **Maintainable**: Tests should be easy to maintain and update
