"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsDomainModule = void 0;
const common_1 = require("@nestjs/common");
const metrics_processor_1 = require("./metrics.processor");
const metrics_validator_1 = require("./metrics.validator");
const report_generator_1 = require("./report.generator");
const metrics_infra_module_1 = require("../infrastructure/metrics-infra.module");
let MetricsDomainModule = class MetricsDomainModule {
};
exports.MetricsDomainModule = MetricsDomainModule;
exports.MetricsDomainModule = MetricsDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [metrics_infra_module_1.MetricsInfraModule],
        providers: [metrics_processor_1.MetricsProcessor, metrics_validator_1.MetricsValidator, report_generator_1.ReportGenerator],
        exports: [metrics_processor_1.MetricsProcessor, metrics_validator_1.MetricsValidator, report_generator_1.ReportGenerator],
    })
], MetricsDomainModule);
//# sourceMappingURL=metrics-domain.module.js.map