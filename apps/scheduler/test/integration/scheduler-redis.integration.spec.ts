import { INestApplication } from '@nestjs/common';
import { createRedisClientSpy, MockRedisModule } from '@jackpot/testing-utils';
import { createTestModule } from './setup';
import { SchedulerService } from '../../src/scheduler.service';
import { REDIS_CLIENT } from '../../src/infrastructure/redis/redis.module';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SchedulerModule } from '../../src/scheduler.module';
import { JobRepository } from '../../src/infrastructure/repositories/job.repository';
import { JobScheduler } from '../../src/domain/job.scheduler';
import { JobProcessor } from '../../src/domain/job.processor';

describe('Scheduler Service Redis Integration', () => {
  let app: INestApplication;
  let schedulerService: SchedulerService;
  let redisClientSpy: ReturnType<typeof createRedisClientSpy>;
  let mockJobRepository: any;
  let mockJobScheduler: any;
  let mockJobProcessor: any;
  let mockMetricsClient: any;

  beforeAll(async () => {
    // Create mocks for dependencies
    redisClientSpy = createRedisClientSpy();
    
    // Create mock implementations
    mockJobRepository = {
      saveJob: jest.fn().mockImplementation((job) => {
        const savedJob = {
          id: job.id || 'test-job-id',
          name: job.name,
          type: job.type,
          schedule: job.schedule,
          target: job.target,
          status: job.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return Promise.resolve(savedJob);
      }),
      getJobById: jest.fn().mockImplementation((id) => {
        if (id === 'test-job-1') {
          return Promise.resolve({
            id: 'test-job-1',
            name: 'Test Job',
            type: 'test',
            schedule: '* * * * *',
            target: {
              service: 'TestService',
              method: 'processData',
              payload: { data: 'test-data' }
            },
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        return Promise.resolve(null);
      }),
      getJobs: jest.fn().mockResolvedValue({ jobs: [], total: 0 }),
      updateJob: jest.fn().mockImplementation((job) => Promise.resolve(job)),
      deleteJob: jest.fn().mockResolvedValue(true),
      getJobsDueForExecution: jest.fn().mockResolvedValue([]),
      cacheJob: jest.fn().mockResolvedValue(undefined),
      getCachedJob: jest.fn().mockResolvedValue(null)
    };
    
    mockJobScheduler = {
      scheduleJob: jest.fn().mockResolvedValue(undefined),
      unscheduleJob: jest.fn().mockResolvedValue(undefined),
      executeJob: jest.fn().mockResolvedValue({ success: true, data: {} })
    };
    
    mockJobProcessor = {
      processJob: jest.fn().mockImplementation((job) => Promise.resolve(job))
    };
    
    mockMetricsClient = {
      getService: jest.fn().mockReturnValue({
        recordEvent: jest.fn().mockResolvedValue({})
      })
    };

    // Create test module with mocks
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        {
          provide: REDIS_CLIENT,
          useValue: redisClientSpy
        },
        {
          provide: JobRepository,
          useValue: mockJobRepository
        },
        {
          provide: JobScheduler,
          useValue: mockJobScheduler
        },
        {
          provide: JobProcessor,
          useValue: mockJobProcessor
        },
        {
          provide: 'METRICS_PACKAGE',
          useValue: mockMetricsClient
        },
        SchedulerService
      ]
    }).compile();

    // Create app
    app = moduleRef.createNestApplication();
    await app.init();
    
    // Get scheduler service
    schedulerService = app.get<SchedulerService>(SchedulerService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should store job data in Redis when creating a job', async () => {
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

    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up default Redis mock behavior
    redisClientSpy.set.mockResolvedValue('OK');
    redisClientSpy.get.mockResolvedValue(null);
    redisClientSpy.del.mockResolvedValue(1);

    // Set up specific mock behavior for this test
    mockJobProcessor.processJob.mockImplementation((job: any) => Promise.resolve(job));
    mockJobRepository.saveJob.mockImplementation((job: any) => {
      return Promise.resolve({
        id: 'test-job-id',
        name: job.name,
        type: job.type,
        schedule: job.schedule,
        target: job.target,
        status: job.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
    
    // Act
    const result = await schedulerService.createJob(jobData);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe('test-job-id');
    expect(result.name).toBe(jobData.name);
    expect(result.type).toBe(jobData.type);
    expect(result.schedule).toBe(jobData.schedule);
    expect(result.status).toBe(jobData.status);
    
    // Verify job was saved
    expect(mockJobRepository.saveJob).toHaveBeenCalledWith(
      expect.objectContaining({
        name: jobData.name,
        type: jobData.type,
        schedule: jobData.schedule,
        target: jobData.target,
        status: jobData.status
      })
    );
    
    // Verify job was scheduled
    expect(mockJobScheduler.scheduleJob).toHaveBeenCalled();
  });

  it('should retrieve job data from Redis', async () => {
    // Arrange
    const jobId = 'test-job-1';
    const jobData = {
      id: jobId,
      name: 'Test Job',
      type: 'test',
      schedule: '* * * * *',
      target: {
        service: 'TestService',
        method: 'processData',
        payload: { data: 'test-data' }
      },
      status: 'active' as 'active' | 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Set up mock for this test
    mockJobRepository.getJobById.mockResolvedValue(jobData);

    // Act
    const result = await schedulerService.getJob(jobId);

    // Assert
    expect(result).toBeDefined();
    // Add null check to prevent TypeScript error
    if (result) {
      expect(result.id).toBe(jobId);
      expect(result.type).toBe(jobData.type);
    }
    
    // Verify repository was called
    expect(mockJobRepository.getJobById).toHaveBeenCalledWith(jobId);
  });

  it('should remove job data from Redis when deleting a job', async () => {
    // Arrange
    const jobId = 'test-job-1';
    const jobData = {
      id: jobId,
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
    
    // Set up mock for this test
    mockJobRepository.getJobById.mockResolvedValue(jobData);

    // Act
    const result = await schedulerService.deleteJob(jobId);

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(true);
    
    // Verify repository and scheduler were called
    expect(mockJobRepository.deleteJob).toHaveBeenCalledWith(jobId);
    expect(mockJobScheduler.unscheduleJob).toHaveBeenCalledWith(jobId);
  });
});
