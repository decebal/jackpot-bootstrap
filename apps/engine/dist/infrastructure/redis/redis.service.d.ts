import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisConfig } from './redis.module';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private client;
    constructor(config: RedisConfig);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
