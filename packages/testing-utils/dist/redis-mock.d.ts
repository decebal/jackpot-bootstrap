import { DynamicModule, Provider } from '@nestjs/common';
import type { Redis } from 'ioredis';
export declare const REDIS_CLIENT = "REDIS_CLIENT";
export declare function createMockRedisProvider(): Provider;
export declare class MockRedisModule {
    static forTest(): DynamicModule;
}
export declare function createRedisClientSpy(methods?: string[]): jest.Mocked<Redis>;
