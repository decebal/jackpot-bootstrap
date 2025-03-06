import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis, { RedisOptions } from 'ioredis'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost')
        const redisPort = configService.get<number>('REDIS_PORT', 6379)
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '')
        const redisPrefix = configService.get<string>('REDIS_PREFIX', 'admin:')
        
        const options: RedisOptions = {
          host: redisHost,
          port: redisPort,
          keyPrefix: redisPrefix,
        }
        
        if (redisPassword) {
          options.password = redisPassword
        }
        
        return new Redis(options)
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
