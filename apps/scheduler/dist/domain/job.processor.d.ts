import { Job, CreateJobRequest, JobProcessorInterface } from './interfaces/scheduler.interface';
import { JobValidator } from './job.validator';
export declare class JobProcessor implements JobProcessorInterface {
    private readonly jobValidator;
    constructor(jobValidator: JobValidator);
    processJob(request: CreateJobRequest): Promise<Job>;
    validateJob(job: Job): boolean;
    private calculateNextExecution;
}
