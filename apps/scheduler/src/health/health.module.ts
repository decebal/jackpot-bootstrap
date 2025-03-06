import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from '../infrastructure/redis/redis.module'

@Module({
	imports: [TypeOrmModule, RedisModule],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService],
})
export class HealthModule {}
