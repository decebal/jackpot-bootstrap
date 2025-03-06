import { Injectable, Inject, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
	private readonly logger = new Logger(RedisService.name)

	constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

	async get(key: string): Promise<string | null> {
		try {
			return await this.redisClient.get(key)
		} catch (error) {
			this.logger.error(`Error getting key ${key} from Redis: ${error.message}`)
			return null
		}
	}

	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		try {
			if (ttlSeconds) {
				await this.redisClient.set(key, value, 'EX', ttlSeconds)
			} else {
				await this.redisClient.set(key, value)
			}
		} catch (error) {
			this.logger.error(`Error setting key ${key} in Redis: ${error.message}`)
		}
	}

	async delete(key: string): Promise<void> {
		try {
			await this.redisClient.del(key)
		} catch (error) {
			this.logger.error(`Error deleting key ${key} from Redis: ${error.message}`)
		}
	}

	async deleteByPattern(pattern: string): Promise<void> {
		try {
			// Get all keys matching pattern
			const keys = await this.redisClient.keys(pattern)
			
			if (keys.length > 0) {
				// Delete all matching keys
				await this.redisClient.del(...keys)
			}
		} catch (error) {
			this.logger.error(`Error deleting keys by pattern ${pattern} from Redis: ${error.message}`)
		}
	}

	async increment(key: string, value = 1): Promise<number> {
		try {
			return await this.redisClient.incrby(key, value)
		} catch (error) {
			this.logger.error(`Error incrementing key ${key} in Redis: ${error.message}`)
			return 0
		}
	}

	async expire(key: string, ttlSeconds: number): Promise<void> {
		try {
			await this.redisClient.expire(key, ttlSeconds)
		} catch (error) {
			this.logger.error(`Error setting expiry for key ${key} in Redis: ${error.message}`)
		}
	}
}
