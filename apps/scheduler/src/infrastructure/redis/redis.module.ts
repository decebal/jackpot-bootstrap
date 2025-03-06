import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from './redis.service'

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: 'REDIS_CLIENT',
			useFactory: (configService: ConfigService) => {
				const host = configService.get('REDIS_HOST', 'localhost')
				const port = configService.get('REDIS_PORT', 6379)
				return {
					host,
					port
				}
			},
			inject: [ConfigService]
		},
		RedisService
	],
	exports: [RedisService]
})
export class RedisModule {}
