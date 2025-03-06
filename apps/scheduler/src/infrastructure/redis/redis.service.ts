import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private redisClient: Redis

	constructor(
		@Inject('REDIS_CLIENT') private readonly redisOptions: { host: string; port: number }
	) {}

	onModuleInit() {
		this.redisClient = new Redis({
			host: this.redisOptions.host,
			port: this.redisOptions.port,
			lazyConnect: true,
			retryStrategy: (times) => {
				// Exponential backoff with max 30 seconds
				return Math.min(times * 1000, 30000)
			}
		})

		this.redisClient.on('error', (error) => {
			console.error('Redis connection error:', error)
		})

		this.redisClient.on('connect', () => {
			console.log(`Connected to Redis at ${this.redisOptions.host}:${this.redisOptions.port}`)
		})

		return this.redisClient.connect()
	}

	onModuleDestroy() {
		return this.redisClient.quit()
	}

	async get(key: string): Promise<string | null> {
		return this.redisClient.get(key)
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (ttl) {
			await this.redisClient.set(key, value, 'EX', ttl)
		} else {
			await this.redisClient.set(key, value)
		}
	}

	async del(key: string): Promise<void> {
		await this.redisClient.del(key)
	}

	async keys(pattern: string): Promise<string[]> {
		return this.redisClient.keys(pattern)
	}

	async ttl(key: string): Promise<number> {
		return this.redisClient.ttl(key)
	}

	async exists(key: string): Promise<boolean> {
		const result = await this.redisClient.exists(key)
		return result === 1
	}

	async ping(): Promise<boolean> {
		try {
			const result = await this.redisClient.ping()
			return result === 'PONG'
		} catch (error) {
			console.error('Redis ping error:', error)
			return false
		}
	}
}
