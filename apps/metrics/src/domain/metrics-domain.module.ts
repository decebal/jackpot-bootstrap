import { Module } from '@nestjs/common'
import { MetricsProcessor } from './metrics.processor'
import { MetricsValidator } from './metrics.validator'
import { ReportGenerator } from './report.generator'
import { MetricsInfraModule } from '../infrastructure/metrics-infra.module'

@Module({
  imports: [MetricsInfraModule],
  providers: [MetricsProcessor, MetricsValidator, ReportGenerator],
  exports: [MetricsProcessor, MetricsValidator, ReportGenerator],
})
export class MetricsDomainModule {}
