import { Repository } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { Job, GetJobsResponse, JobRepositoryInterface } from '../../domain/interfaces/scheduler.interface';
import { RedisService } from '../redis/redis.service';
export declare class JobRepository implements JobRepositoryInterface {
    private readonly jobRepository;
    private readonly redisService;
    private readonly CACHE_TTL;
    private readonly CACHE_PREFIX;
    constructor(jobRepository: Repository<JobEntity>, redisService: RedisService);
    saveJob(job: Job): Promise<Job>;
    getJobById(id: string): Promise<Job | null>;
    getJobs(status?: string, type?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetJobsResponse>;
    updateJob(job: Job): Promise<Job>;
    deleteJob(id: string): Promise<boolean>;
    getJobsDueForExecution(): Promise<Job[]>;
    private cacheJob;
    private getCachedJob;
}
