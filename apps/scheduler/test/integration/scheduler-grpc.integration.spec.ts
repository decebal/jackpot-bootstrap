import { INestApplication } from '@nestjs/common';
import { createMockGrpcServer, createGrpcTestClient } from '@jackpot/testing-utils';
import { createTestApp } from './setup';
import { SchedulerService } from '../../src/scheduler.service';

describe('Scheduler Service gRPC Integration', () => {
  let app: INestApplication;
  let schedulerService: SchedulerService;
  let mockEngineServer: ReturnType<typeof createMockGrpcServer>;
  // We don't need the mockMetricsServer anymore as we're mocking the client directly

  beforeAll(async () => {
    // Setup mock gRPC server for engine service
    mockEngineServer = createMockGrpcServer(
      'protos/engine.proto',
      'engine',
      'EngineService',
      {
        processJob: (call: any, callback: any) => {
          const { jobId, payload } = call.request;
          callback(null, { 
            success: true, 
            jobId, 
            result: { processed: true, data: payload } 
          });
        },
      },
      'localhost:50052'
    );

    // Start mock engine server
    await mockEngineServer.start();
    
    // Note: We don't need to create a mock metrics server anymore
    // because we've mocked the metrics client in the setup.ts file

    // Create test app
    app = await createTestApp();
    schedulerService = app.get<SchedulerService>(SchedulerService);
  });

  afterAll(async () => {
    // Stop mock engine server
    await mockEngineServer.stop();
    
    // Close app
    await app.close();
  });

  it('should create a job and communicate with engine service', async () => {
    // Arrange
    const jobData = {
      name: 'Test Job',
      type: 'test',
      schedule: '* * * * *', // Run every minute
      target: {
        service: 'TestService',
        method: 'processData',
        payload: { data: 'test-data' }
      },
      status: 'active' as 'active' | 'inactive'
    };

    // Act
    const result = await schedulerService.createJob(jobData);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
    expect(result.type).toBe(jobData.type);
    expect(result.status).toBe('active');
  });

  it('should delete a scheduled job', async () => {
    // Arrange
    // First create a job
    const jobData = {
      name: 'Test Job',
      type: 'test',
      schedule: '* * * * *',
      target: {
        service: 'TestService',
        method: 'processData',
        payload: { data: 'test-data' }
      },
      status: 'active' as 'active' | 'inactive'
    };
    const createdJob = await schedulerService.createJob(jobData);
    const jobId = createdJob.id;

    // Act
    // Ensure jobId is not undefined
    if (!jobId) {
      throw new Error('Job ID is undefined');
    }
    const result = await schedulerService.deleteJob(jobId);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });
});
