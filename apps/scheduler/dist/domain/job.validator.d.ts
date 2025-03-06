import { Job } from './interfaces/scheduler.interface';
export declare class JobValidator {
    private jobSchema;
    validateJob(job: Job): boolean;
    private validateCronExpression;
}
