import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CONFIG } from './redis.constants';

export interface RedisConfig {
  host: string;
  port: number;
}

@Module({})
export class RedisModule {
  static forRootAsync(options: {
    imports: any[];
    useFactory: (...args: any[]) => Promise<RedisConfig> | RedisConfig;
    inject: any[];
  }): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: REDIS_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        RedisService,
      ],
      exports: [RedisService],
      global: true,
    };
  }
}
