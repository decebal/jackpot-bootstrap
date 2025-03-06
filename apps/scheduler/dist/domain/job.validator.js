"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidator = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
let JobValidator = class JobValidator {
    constructor() {
        this.jobSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string().min(1).max(100),
            type: zod_1.z.string().min(1).max(50),
            schedule: zod_1.z.string().min(1),
            target: zod_1.z.object({
                service: zod_1.z.string().min(1),
                method: zod_1.z.string().min(1),
                payload: zod_1.z.any()
            }),
            status: zod_1.z.enum(['active', 'inactive', 'completed', 'failed']),
            created_at: zod_1.z.string().datetime(),
            updated_at: zod_1.z.string().datetime(),
            last_executed_at: zod_1.z.string().datetime().optional(),
            next_execution: zod_1.z.string().datetime().optional(),
            result: zod_1.z.any().optional(),
            error: zod_1.z.string().optional(),
            metadata: zod_1.z.record(zod_1.z.any()).optional(),
            retries: zod_1.z.number().int().min(0).optional(),
            max_retries: zod_1.z.number().int().min(0).optional(),
            timeout: zod_1.z.number().int().min(1000).optional()
        });
    }
    validateJob(job) {
        try {
            this.jobSchema.parse(job);
            return this.validateCronExpression(job.schedule);
        }
        catch (error) {
            console.error('Job validation error:', error);
            return false;
        }
    }
    validateCronExpression(cronExpression) {
        const cronRegex = /^(\*|\d+|\d+-\d+|\d+\/\d+|\d+,\d+)(\s+(\*|\d+|\d+-\d+|\d+\/\d+|\d+,\d+)){4}$/;
        return cronRegex.test(cronExpression);
    }
};
exports.JobValidator = JobValidator;
exports.JobValidator = JobValidator = __decorate([
    (0, common_1.Injectable)()
], JobValidator);
//# sourceMappingURL=job.validator.js.map