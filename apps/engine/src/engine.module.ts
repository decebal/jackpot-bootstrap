import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './infrastructure/redis/redis.module';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';
import { EngineDomainModule } from './domain/engine-domain.module';
import { EngineInfraModule } from './infrastructure/engine-infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'mysql-service'),
        port: configService.get('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST', 'redis-engine'),
        port: configService.get('REDIS_PORT', 6379),
      }),
      inject: [ConfigService],
    }),
    EngineDomainModule,
    EngineInfraModule,
  ],
  controllers: [EngineController],
  providers: [EngineService],
})
export class EngineModule {}
