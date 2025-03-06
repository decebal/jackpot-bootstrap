import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly redisOptions;
    private redisClient;
    constructor(redisOptions: {
        host: string;
        port: number;
    });
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<"OK">;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    keys(pattern: string): Promise<string[]>;
    ttl(key: string): Promise<number>;
    exists(key: string): Promise<boolean>;
    ping(): Promise<boolean>;
}
