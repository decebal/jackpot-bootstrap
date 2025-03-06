import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MetricsEntity } from './entities/metrics.entity'
import { MetricsRepository } from './repositories/metrics.repository'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([MetricsEntity]),
		RedisModule,
	],
	providers: [MetricsRepository],
	exports: [MetricsRepository],
})
export class MetricsInfraModule {}
