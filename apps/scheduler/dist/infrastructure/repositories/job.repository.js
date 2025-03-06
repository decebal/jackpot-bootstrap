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
exports.JobRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../entities/job.entity");
const redis_service_1 = require("../redis/redis.service");
let JobRepository = class JobRepository {
    constructor(jobRepository, redisService) {
        this.jobRepository = jobRepository;
        this.redisService = redisService;
        this.CACHE_TTL = 60 * 5;
        this.CACHE_PREFIX = 'job:';
    }
    async saveJob(job) {
        const savedJob = await this.jobRepository.save(job);
        await this.cacheJob(savedJob);
        return savedJob;
    }
    async getJobById(id) {
        const cachedJob = await this.getCachedJob(id);
        if (cachedJob) {
            return cachedJob;
        }
        const job = await this.jobRepository.findOne({ where: { id } });
        if (job) {
            await this.cacheJob(job);
            return job;
        }
        return null;
    }
    async getJobs(status, type, startDate, endDate, limit = 10, offset = 0) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (type) {
            where.type = type;
        }
        if (startDate && endDate) {
            where.created_at = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.created_at = (0, typeorm_2.LessThanOrEqual)(startDate);
        }
        const total = await this.jobRepository.count({ where });
        const jobs = await this.jobRepository.find({
            where,
            order: { created_at: 'DESC' },
            take: limit,
            skip: offset
        });
        return { jobs, total };
    }
    async updateJob(job) {
        await this.jobRepository.update(job.id, job);
        const updatedJob = await this.jobRepository.findOne({ where: { id: job.id } });
        if (!updatedJob) {
            throw new Error(`Job with ID ${job.id} not found after update`);
        }
        await this.cacheJob(updatedJob);
        return updatedJob;
    }
    async deleteJob(id) {
        const result = await this.jobRepository.delete(id);
        await this.redisService.del(`${this.CACHE_PREFIX}${id}`);
        return result.affected !== null && result.affected !== undefined && result.affected > 0;
    }
    async getJobsDueForExecution() {
        const now = new Date().toISOString();
        return this.jobRepository.find({
            where: {
                status: 'active',
                next_execution: (0, typeorm_2.LessThanOrEqual)(now)
            }
        });
    }
    async cacheJob(job) {
        await this.redisService.set(`${this.CACHE_PREFIX}${job.id}`, JSON.stringify(job), this.CACHE_TTL);
    }
    async getCachedJob(id) {
        const cachedJob = await this.redisService.get(`${this.CACHE_PREFIX}${id}`);
        if (cachedJob) {
            try {
                return JSON.parse(cachedJob);
            }
            catch (error) {
                console.error(`Error parsing cached job ${id}:`, error);
            }
        }
        return null;
    }
};
exports.JobRepository = JobRepository;
exports.JobRepository = JobRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.JobEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService])
], JobRepository);
//# sourceMappingURL=job.repository.js.map