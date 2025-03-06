import { Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: 'REDIS_CLIENT',
			useFactory: async (configService: ConfigService) => {
				const Redis = await import('ioredis')
				return new Redis.default({
					host: configService.get('REDIS_HOST', 'localhost'),
					port: configService.get('REDIS_PORT', 6379),
					password: configService.get('REDIS_PASSWORD', ''),
					keyPrefix: 'metrics:',
					retryStrategy: (times) => {
						// Exponential backoff with max 30 seconds
						return Math.min(times * 100, 30000)
					}
				})
			},
			inject: [ConfigService]
		},
		RedisService
	],
	exports: [RedisService]
})
export class RedisModule {}
