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
var MetricsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const metrics_service_1 = require("./metrics.service");
let MetricsController = MetricsController_1 = class MetricsController {
    constructor(metricsService) {
        this.metricsService = metricsService;
        this.logger = new common_1.Logger(MetricsController_1.name);
    }
    async collectMetrics(request) {
        try {
            this.logger.log(`Collecting metrics from source: ${request.source}, event type: ${request.event_type}`);
            const result = await this.metricsService.collectMetrics(request);
            return { success: true, metric: result };
        }
        catch (error) {
            this.logger.error(`Error collecting metrics: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async getMetrics(request) {
        try {
            this.logger.log(`Getting metrics with filters: ${JSON.stringify(request)}`);
            const result = await this.metricsService.getMetrics(request.source || '', request.event_type || '', request.start_date || '', request.end_date || '', request.limit || 100, request.offset || 0);
            return { success: true, ...result };
        }
        catch (error) {
            this.logger.error(`Error getting metrics: ${error.message}`, error.stack);
            return { success: false, error: error.message, metrics: [], total: 0 };
        }
    }
    async getMetricById(request) {
        try {
            this.logger.log(`Getting metric by ID: ${request.id}`);
            const metric = await this.metricsService.getMetricById(request.id);
            return { success: true, metric };
        }
        catch (error) {
            this.logger.error(`Error getting metric by ID: ${error.message}`, error.stack);
            return { success: false, error: error.message, metric: null };
        }
    }
    async generateReport(request) {
        try {
            this.logger.log(`Generating report of type: ${request.report_type}, format: ${request.format}`);
            const report = await this.metricsService.generateReport(request.report_type, request.start_date, request.end_date, request.format);
            return { success: true, report };
        }
        catch (error) {
            this.logger.error(`Error generating report: ${error.message}`, error.stack);
            return { success: false, error: error.message, report: null };
        }
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, microservices_1.GrpcMethod)('MetricsService', 'CollectMetrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "collectMetrics", null);
__decorate([
    (0, microservices_1.GrpcMethod)('MetricsService', 'GetMetrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetrics", null);
__decorate([
    (0, microservices_1.GrpcMethod)('MetricsService', 'GetMetricById'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetricById", null);
__decorate([
    (0, microservices_1.GrpcMethod)('MetricsService', 'GenerateReport'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "generateReport", null);
exports.MetricsController = MetricsController = MetricsController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map