import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SchedulerModule } from '../../src/scheduler.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockRedisModule } from '@jackpot/testing-utils';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

/**
 * Creates a test application for integration testing
 * @returns A NestJS application instance for testing
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      MockRedisModule.forTest(),
      SchedulerModule,
    ],
  })
  .overrideProvider('METRICS_PACKAGE')
  .useFactory({
    factory: () => ({
      getService: () => ({
        collectMetrics: () => ({
          pipe: () => ({
            toPromise: () => Promise.resolve({
              id: 'mock-metric-id',
              source: 'scheduler',
              event_type: 'test-event',
              data: {},
              timestamp: new Date().toISOString()
            })
          })
        })
      })
    })
  })
  .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  
  return app;
}

/**
 * Creates a test module for integration testing
 * @returns A NestJS testing module
 */
export async function createTestModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      MockRedisModule.forTest(),
      SchedulerModule,
    ],
  })
  .overrideProvider('METRICS_PACKAGE')
  .useFactory({
    factory: () => ({
      getService: () => ({
        collectMetrics: () => ({
          pipe: () => ({
            toPromise: () => Promise.resolve({
              id: 'mock-metric-id',
              source: 'scheduler',
              event_type: 'test-event',
              data: {},
              timestamp: new Date().toISOString()
            })
          })
        })
      })
    })
  })
  .compile();
}
