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
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const metrics_repository_1 = require("./infrastructure/repositories/metrics.repository");
const metrics_processor_1 = require("./domain/metrics.processor");
const report_generator_1 = require("./domain/report.generator");
let MetricsService = MetricsService_1 = class MetricsService {
    constructor(metricsRepository, metricsProcessor, reportGenerator) {
        this.metricsRepository = metricsRepository;
        this.metricsProcessor = metricsProcessor;
        this.reportGenerator = reportGenerator;
        this.logger = new common_1.Logger(MetricsService_1.name);
    }
    async collectMetrics(request) {
        this.logger.debug(`Processing metrics request: ${JSON.stringify(request)}`);
        const processedMetric = await this.metricsProcessor.processMetrics(request);
        return this.metricsRepository.saveMetric(processedMetric);
    }
    async getMetrics(source, eventType, startDate, endDate, limit, offset) {
        this.logger.debug(`Getting metrics with filters: source=${source}, eventType=${eventType}`);
        return this.metricsRepository.getMetrics(source, eventType, startDate, endDate, limit, offset);
    }
    async getMetricById(id) {
        this.logger.debug(`Getting metric by ID: ${id}`);
        return this.metricsRepository.getMetricById(id);
    }
    async generateReport(reportType, startDate, endDate, format) {
        this.logger.debug(`Generating report: type=${reportType}, format=${format}`);
        return this.reportGenerator.generateReport(reportType, startDate, endDate, format);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_repository_1.MetricsRepository,
        metrics_processor_1.MetricsProcessor,
        report_generator_1.ReportGenerator])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map