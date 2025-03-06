import { ClientGrpc } from '@nestjs/microservices';
import { CreateJobRequest, JobResponse, GetJobsResponse, UpdateJobRequest, ExecuteJobResponse } from './domain/interfaces/scheduler.interface';
import { JobProcessor } from './domain/job.processor';
import { JobRepository } from './infrastructure/repositories/job.repository';
import { JobScheduler } from './domain/job.scheduler';
export declare class SchedulerService {
    private readonly jobProcessor;
    private readonly jobRepository;
    private readonly jobScheduler;
    private readonly metricsClient;
    private metricsService;
    constructor(jobProcessor: JobProcessor, jobRepository: JobRepository, jobScheduler: JobScheduler, metricsClient: ClientGrpc);
    onModuleInit(): void;
    createJob(request: CreateJobRequest): Promise<JobResponse>;
    getJob(id: string): Promise<JobResponse | null>;
    getJobs(status?: string, type?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetJobsResponse>;
    updateJob(request: UpdateJobRequest): Promise<JobResponse>;
    deleteJob(id: string): Promise<boolean>;
    executeJob(id: string): Promise<ExecuteJobResponse>;
    private recordMetric;
}
