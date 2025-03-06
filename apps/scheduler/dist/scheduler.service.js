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
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const job_processor_1 = require("./domain/job.processor");
const job_repository_1 = require("./infrastructure/repositories/job.repository");
const job_scheduler_1 = require("./domain/job.scheduler");
let SchedulerService = class SchedulerService {
    constructor(jobProcessor, jobRepository, jobScheduler, metricsClient) {
        this.jobProcessor = jobProcessor;
        this.jobRepository = jobRepository;
        this.jobScheduler = jobScheduler;
        this.metricsClient = metricsClient;
    }
    onModuleInit() {
        this.metricsService = this.metricsClient.getService('MetricsService');
    }
    async createJob(request) {
        const processedJob = await this.jobProcessor.processJob(request);
        const savedJob = await this.jobRepository.saveJob(processedJob);
        if (savedJob.status === 'active') {
            await this.jobScheduler.scheduleJob(savedJob);
        }
        await this.recordMetric('job_created', {
            job_id: savedJob.id,
            job_type: savedJob.type,
        });
        return savedJob;
    }
    async getJob(id) {
        return this.jobRepository.getJobById(id);
    }
    async getJobs(status, type, startDate, endDate, limit = 10, offset = 0) {
        return this.jobRepository.getJobs(status, type, startDate, endDate, limit, offset);
    }
    async updateJob(request) {
        const existingJob = await this.jobRepository.getJobById(request.id);
        if (!existingJob) {
            throw new Error(`Job with ID ${request.id} not found`);
        }
        const updatedJob = {
            ...existingJob,
            ...request,
            updated_at: new Date().toISOString()
        };
        const savedJob = await this.jobRepository.updateJob(updatedJob);
        if (request.status && request.status !== existingJob.status) {
            if (request.status === 'active') {
                await this.jobScheduler.scheduleJob(savedJob);
            }
            else if (request.status === 'inactive' || request.status === 'completed') {
                await this.jobScheduler.unscheduleJob(savedJob.id);
            }
        }
        await this.recordMetric('job_updated', {
            job_id: savedJob.id,
            job_type: savedJob.type,
            status: savedJob.status
        });
        return savedJob;
    }
    async deleteJob(id) {
        const job = await this.jobRepository.getJobById(id);
        if (!job) {
            return false;
        }
        await this.jobScheduler.unscheduleJob(id);
        const result = await this.jobRepository.deleteJob(id);
        if (result) {
            await this.recordMetric('job_deleted', {
                job_id: id,
                job_type: job.type
            });
        }
        return result;
    }
    async executeJob(id) {
        const job = await this.jobRepository.getJobById(id);
        if (!job) {
            throw new Error(`Job with ID ${id} not found`);
        }
        try {
            const result = await this.jobScheduler.executeJob(job);
            if (result.success) {
                await this.updateJob({
                    id,
                    status: 'completed',
                    last_executed_at: new Date().toISOString(),
                    result: result.data
                });
            }
            else {
                await this.updateJob({
                    id,
                    status: 'failed',
                    last_executed_at: new Date().toISOString(),
                    error: result.error
                });
            }
            await this.recordMetric('job_executed', {
                job_id: id,
                job_type: job.type,
                success: result.success,
                execution_time: result.executionTime
            });
            return result;
        }
        catch (error) {
            await this.updateJob({
                id,
                status: 'failed',
                last_executed_at: new Date().toISOString(),
                error: error.message
            });
            await this.recordMetric('job_execution_failed', {
                job_id: id,
                job_type: job.type,
                error: error.message
            });
            return {
                success: false,
                error: error.message,
                executionTime: 0
            };
        }
    }
    async recordMetric(eventType, data) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.metricsService.collectMetrics({
                source: 'scheduler',
                event_type: eventType,
                data
            }));
        }
        catch (error) {
            console.error(`Failed to record metric ${eventType}:`, error);
        }
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)('METRICS_PACKAGE')),
    __metadata("design:paramtypes", [job_processor_1.JobProcessor,
        job_repository_1.JobRepository,
        job_scheduler_1.JobScheduler, Object])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map