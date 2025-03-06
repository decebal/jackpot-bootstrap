"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobScheduler = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const job_repository_1 = require("../infrastructure/repositories/job.repository");
let JobScheduler = class JobScheduler {
    constructor(jobRepository, metricsClient) {
        this.jobRepository = jobRepository;
        this.metricsClient = metricsClient;
        this.scheduledJobs = new Map();
        this.serviceClients = new Map();
    }
    onModuleInit() {
        this.serviceClients.set('metrics', this.metricsClient.getService('MetricsService'));
        this.loadActiveJobs();
    }
    async loadActiveJobs() {
        try {
            const { jobs } = await this.jobRepository.getJobs('active', undefined, undefined, undefined, 1000, 0);
            for (const job of jobs) {
                await this.scheduleJob(job);
            }
            console.log(`Loaded and scheduled ${jobs.length} active jobs`);
        }
        catch (error) {
            console.error('Error loading active jobs:', error);
        }
    }
    async scheduleJob(job) {
        await this.unscheduleJob(job.id);
        const now = new Date();
        const nextExecution = new Date(job.next_execution || now.toISOString());
        const delay = Math.max(0, nextExecution.getTime() - now.getTime());
        const timeout = setTimeout(async () => {
            try {
                await this.executeJob(job);
                const updatedJob = await this.jobRepository.getJobById(job.id);
                if (updatedJob && updatedJob.status === 'active') {
                    const nextExecution = this.calculateNextExecution(updatedJob.schedule);
                    await this.jobRepository.updateJob({
                        ...updatedJob,
                        next_execution: nextExecution
                    });
                    await this.scheduleJob({
                        ...updatedJob,
                        next_execution: nextExecution
                    });
                }
            }
            catch (error) {
                console.error(`Error executing scheduled job ${job.id}:`, error);
            }
        }, delay);
        this.scheduledJobs.set(job.id, timeout);
        console.log(`Scheduled job ${job.id} (${job.name}) to run at ${nextExecution.toISOString()}`);
    }
    async unscheduleJob(jobId) {
        const timeout = this.scheduledJobs.get(jobId);
        if (timeout) {
            clearTimeout(timeout);
            this.scheduledJobs.delete(jobId);
            console.log(`Unscheduled job ${jobId}`);
        }
    }
    async executeJob(job) {
        console.log(`Executing job ${job.id} (${job.name})`);
        const startTime = Date.now();
        try {
            const serviceClient = this.serviceClients.get(job.target.service);
            if (!serviceClient) {
                throw new Error(`Service client not found for ${job.target.service}`);
            }
            if (!serviceClient[job.target.method]) {
                throw new Error(`Method ${job.target.method} not found in service ${job.target.service}`);
            }
            const result = await (0, rxjs_1.firstValueFrom)(serviceClient[job.target.method](job.target.payload));
            const executionTime = Date.now() - startTime;
            return {
                success: true,
                data: result,
                executionTime
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const retries = job.retries || 0;
            const maxRetries = job.max_retries || 3;
            if (retries < maxRetries) {
                await this.jobRepository.updateJob({
                    ...job,
                    retries: retries + 1,
                    error: error.message,
                    last_executed_at: new Date().toISOString()
                });
                const retryDelay = Math.min(30000, 1000 * Math.pow(2, retries));
                setTimeout(() => {
                    this.executeJob(job).catch(err => {
                        console.error(`Error in retry execution of job ${job.id}:`, err);
                    });
                }, retryDelay);
                console.log(`Scheduled retry for job ${job.id} in ${retryDelay}ms (retry ${retries + 1}/${maxRetries})`);
            }
            return {
                success: false,
                error: error.message,
                executionTime
            };
        }
    }
    calculateNextExecution(cronExpression) {
        try {
            const now = new Date();
            const nextExecution = new Date(now.getTime() + 60 * 60 * 1000);
            return nextExecution.toISOString();
        }
        catch (error) {
            console.error('Error calculating next execution time:', error);
            const now = new Date();
            const nextExecution = new Date(now.getTime() + 60 * 60 * 1000);
            return nextExecution.toISOString();
        }
    }
};
exports.JobScheduler = JobScheduler;
exports.JobScheduler = JobScheduler = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('METRICS_PACKAGE')),
    __metadata("design:paramtypes", [job_repository_1.JobRepository, Object])
], JobScheduler);
//# sourceMappingURL=job.scheduler.js.map