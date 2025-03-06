import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { MetricsEntity } from '../infrastructure/entities/metrics.entity'
import { RedisModule } from '../infrastructure/redis/redis.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([MetricsEntity]),
		RedisModule
	],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService]
})
export class HealthModule {}
