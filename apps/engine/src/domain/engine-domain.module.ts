import { Module } from '@nestjs/common';
import { EngineProcessor } from './engine.processor';
import { EngineValidator } from './engine.validator';

@Module({
  providers: [EngineProcessor, EngineValidator],
  exports: [EngineProcessor],
})
export class EngineDomainModule {}
