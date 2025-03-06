import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineEntity } from './entities/engine.entity';
import { EngineRepository } from './repositories/engine.repository';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EngineEntity]),
    RedisModule,
  ],
  providers: [EngineRepository],
  exports: [EngineRepository],
})
export class EngineInfraModule {}
