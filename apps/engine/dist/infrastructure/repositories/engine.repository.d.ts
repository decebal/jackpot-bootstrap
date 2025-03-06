import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { EngineEntity } from '../entities/engine.entity';
import { IEngineRepository, ProcessResponse } from '../../domain/interfaces/engine.interface';
export declare class EngineRepository implements IEngineRepository {
    private readonly repository;
    private readonly redisService;
    private readonly CACHE_TTL;
    private readonly CACHE_PREFIX;
    constructor(repository: Repository<EngineEntity>, redisService: RedisService);
    save(data: ProcessResponse): Promise<void>;
    getStatus(id: string): Promise<ProcessResponse>;
    private getCacheKey;
}
