import { Redis } from 'ioredis';
export declare class RedisService {
    private readonly redisClient;
    private readonly logger;
    constructor(redisClient: Redis);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    deleteByPattern(pattern: string): Promise<void>;
    increment(key: string, value?: number): Promise<number>;
    expire(key: string, ttlSeconds: number): Promise<void>;
}
