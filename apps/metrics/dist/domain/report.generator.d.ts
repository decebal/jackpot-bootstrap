import { MetricsValidator } from './metrics.validator';
import { ReportData } from './interfaces/metrics.interface';
import { MetricsRepository } from '../infrastructure/repositories/metrics.repository';
export declare class ReportGenerator {
    private readonly validator;
    private readonly metricsRepository;
    constructor(validator: MetricsValidator, metricsRepository: MetricsRepository);
    generateReport(reportType: string, startDate: string, endDate: string, format: string): Promise<ReportData>;
    private processReportData;
    private applyReportLogic;
    private generateSummaryReport;
    private generateDetailedReport;
    private convertToCSV;
}
