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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProcessor = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const job_validator_1 = require("./job.validator");
let JobProcessor = class JobProcessor {
    constructor(jobValidator) {
        this.jobValidator = jobValidator;
    }
    async processJob(request) {
        const now = new Date().toISOString();
        const job = {
            id: (0, uuid_1.v4)(),
            name: request.name,
            type: request.type,
            schedule: request.schedule,
            target: request.target,
            status: request.status || 'active',
            created_at: now,
            updated_at: now,
            metadata: request.metadata || {},
            retries: 0,
            max_retries: request.max_retries || 3,
            timeout: request.timeout || 30000,
        };
        if (!this.jobValidator.validateJob(job)) {
            throw new Error('Invalid job request');
        }
        job.next_execution = this.calculateNextExecution(job.schedule);
        return job;
    }
    validateJob(job) {
        return this.jobValidator.validateJob(job);
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
exports.JobProcessor = JobProcessor;
exports.JobProcessor = JobProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [job_validator_1.JobValidator])
], JobProcessor);
//# sourceMappingURL=job.processor.js.map