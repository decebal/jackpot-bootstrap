import { SchedulerService } from './scheduler.service';
import { CreateJobRequest, JobResponse, GetJobRequest, GetJobsRequest, GetJobsResponse, UpdateJobRequest, DeleteJobRequest, DeleteJobResponse, ExecuteJobRequest, ExecuteJobResponse } from './domain/interfaces/scheduler.interface';
export declare class SchedulerController {
    private readonly schedulerService;
    constructor(schedulerService: SchedulerService);
    createJob(request: CreateJobRequest): Promise<JobResponse>;
    getJob(request: GetJobRequest): Promise<JobResponse>;
    getJobs(request: GetJobsRequest): Promise<GetJobsResponse>;
    updateJob(request: UpdateJobRequest): Promise<JobResponse>;
    deleteJob(request: DeleteJobRequest): Promise<DeleteJobResponse>;
    executeJob(request: ExecuteJobRequest): Promise<ExecuteJobResponse>;
}
