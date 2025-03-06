import { ClientGrpc } from '@nestjs/microservices';
import { Job, ExecuteJobResponse, JobSchedulerInterface } from './interfaces/scheduler.interface';
import { JobRepository } from '../infrastructure/repositories/job.repository';
export declare class JobScheduler implements JobSchedulerInterface {
    private readonly jobRepository;
    private readonly metricsClient;
    private scheduledJobs;
    private serviceClients;
    constructor(jobRepository: JobRepository, metricsClient: ClientGrpc);
    onModuleInit(): void;
    private loadActiveJobs;
    scheduleJob(job: Job): Promise<void>;
    unscheduleJob(jobId: string): Promise<void>;
    executeJob(job: Job): Promise<ExecuteJobResponse>;
    private calculateNextExecution;
}
