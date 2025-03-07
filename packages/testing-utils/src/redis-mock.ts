import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import IORedis from 'ioredis';
import type { Redis } from 'ioredis';
import RedisMock from 'ioredis-mock';

/**
 * Provider token for Redis client
 */
export const REDIS_CLIENT = 'REDIS_CLIENT';

/**
 * Creates a mock Redis provider for testing
 * @returns A provider with a mock Redis client
 */
export function createMockRedisProvider(): Provider {
  return {
    provide: REDIS_CLIENT,
    useFactory: () => {
      return new RedisMock();
    },
  };
}

/**
 * Module that provides a mock Redis client for testing
 */
@Global()
@Module({})
export class MockRedisModule {
  static forTest(): DynamicModule {
    return {
      module: MockRedisModule,
      providers: [createMockRedisProvider()],
      exports: [REDIS_CLIENT],
    };
  }
}

/**
 * Helper function to create a Redis client spy
 * @param methods - Methods to spy on
 * @returns A Redis client with spied methods
 */
export function createRedisClientSpy(methods: string[] = [
  'get',
  'set',
  'del',
  'hget',
  'hset',
  'hdel',
  'hgetall',
  'hmset',
  'expire',
  'publish',
  'subscribe',
]): jest.Mocked<Redis> {
  const redisMock = new RedisMock();
  
  methods.forEach((method) => {
    jest.spyOn(redisMock, method as any);
  });
  
  return redisMock as jest.Mocked<Redis>;
}
