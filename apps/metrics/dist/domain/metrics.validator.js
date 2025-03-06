"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsValidator = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
let MetricsValidator = class MetricsValidator {
    constructor() {
        this.metricsRequestSchema = zod_1.z.object({
            source: zod_1.z.string().min(1, 'Source is required'),
            event_type: zod_1.z.string().min(1, 'Event type is required'),
            data: zod_1.z.any(),
            timestamp: zod_1.z.string().datetime().optional(),
        });
        this.reportRequestSchema = zod_1.z.object({
            report_type: zod_1.z.string().min(1, 'Report type is required'),
            start_date: zod_1.z.string().datetime(),
            end_date: zod_1.z.string().datetime(),
            format: zod_1.z.enum(['json', 'csv']),
        });
    }
    async validateMetricsRequest(data) {
        return this.metricsRequestSchema.parseAsync(data);
    }
    async validateReportRequest(data) {
        return this.reportRequestSchema.parseAsync(data);
    }
};
exports.MetricsValidator = MetricsValidator;
exports.MetricsValidator = MetricsValidator = __decorate([
    (0, common_1.Injectable)()
], MetricsValidator);
//# sourceMappingURL=metrics.validator.js.map