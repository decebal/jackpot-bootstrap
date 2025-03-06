import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { EngineEntity } from '../entities/engine.entity';
import { IEngineRepository, ProcessResponse } from '../../domain/interfaces/engine.interface';

@Injectable()
export class EngineRepository implements IEngineRepository {
  private readonly CACHE_TTL = 3600; // 1 hour in seconds
  private readonly CACHE_PREFIX = 'engine:';

  constructor(
    @InjectRepository(EngineEntity)
    private readonly repository: Repository<EngineEntity>,
    private readonly redisService: RedisService,
  ) {}

  async save(data: ProcessResponse): Promise<void> {
    // Following functional programming principles from our standards
    const entity = this.repository.create({
      id: data.id,
      status: data.status,
      result: data.result as Record<string, unknown>,
      data: {} // Initialize with empty object
    });

    // Save to database
    await this.repository.save(entity);

    // Cache the result
    await this.redisService.set(
      this.getCacheKey(data.id),
      JSON.stringify(data),
      this.CACHE_TTL
    );
  }

  async getStatus(id: string): Promise<ProcessResponse> {
    // Try cache first
    const cached = await this.redisService.get(this.getCacheKey(id));
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, get from database
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`No request found with id ${id}`);
    }

    const response: ProcessResponse = {
      id: entity.id,
      status: entity.status as 'pending' | 'completed' | 'failed',
      result: entity.result,
      timestamp: entity.updatedAt.toISOString(),
    };

    // Cache the result
    await this.redisService.set(
      this.getCacheKey(id),
      JSON.stringify(response),
      this.CACHE_TTL
    );

    return response;
  }

  private getCacheKey(id: string): string {
    return `${this.CACHE_PREFIX}${id}`;
  }
}
