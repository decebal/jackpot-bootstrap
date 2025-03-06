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
exports.ReportGenerator = void 0;
const common_1 = require("@nestjs/common");
const metrics_validator_1 = require("./metrics.validator");
const uuid_1 = require("uuid");
const metrics_repository_1 = require("../infrastructure/repositories/metrics.repository");
let ReportGenerator = class ReportGenerator {
    constructor(validator, metricsRepository) {
        this.validator = validator;
        this.metricsRepository = metricsRepository;
    }
    async generateReport(reportType, startDate, endDate, format) {
        await this.validator.validateReportRequest({
            report_type: reportType,
            start_date: startDate,
            end_date: endDate,
            format
        });
        const { metrics } = await this.metricsRepository.getMetrics('', '', startDate, endDate, 1000, 0);
        const reportData = this.processReportData(reportType, metrics, format);
        return {
            id: (0, uuid_1.v4)(),
            type: reportType,
            data: reportData,
            format,
            timestamp: new Date().toISOString()
        };
    }
    processReportData(reportType, metrics, format) {
        const processedData = this.applyReportLogic(reportType, metrics);
        return format === 'csv'
            ? this.convertToCSV(processedData)
            : processedData;
    }
    applyReportLogic(reportType, metrics) {
        switch (reportType) {
            case 'summary':
                return this.generateSummaryReport(metrics);
            case 'detailed':
                return this.generateDetailedReport(metrics);
            default:
                return metrics;
        }
    }
    generateSummaryReport(metrics) {
        const summary = metrics.reduce((acc, metric) => {
            const key = `${metric.source}:${metric.event_type}`;
            if (!acc[key]) {
                acc[key] = {
                    source: metric.source,
                    event_type: metric.event_type,
                    count: 0
                };
            }
            acc[key].count++;
            return acc;
        }, {});
        return Object.values(summary);
    }
    generateDetailedReport(metrics) {
        return metrics.map(metric => ({
            id: metric.id,
            source: metric.source,
            event_type: metric.event_type,
            timestamp: metric.timestamp,
            data: typeof metric.data === 'object'
                ? metric.data
                : JSON.parse(metric.data.toString())
        }));
    }
    convertToCSV(data) {
        if (!data.length)
            return '';
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'object'
                    ? `"${JSON.stringify(value).replace(/"/g, '""')}"`
                    : `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }
};
exports.ReportGenerator = ReportGenerator;
exports.ReportGenerator = ReportGenerator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_validator_1.MetricsValidator,
        metrics_repository_1.MetricsRepository])
], ReportGenerator);
//# sourceMappingURL=report.generator.js.map