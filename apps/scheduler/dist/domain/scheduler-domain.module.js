"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerDomainModule = void 0;
const common_1 = require("@nestjs/common");
const job_processor_1 = require("./job.processor");
const job_validator_1 = require("./job.validator");
const job_scheduler_1 = require("./job.scheduler");
const scheduler_infrastructure_module_1 = require("../infrastructure/scheduler-infrastructure.module");
const grpc_module_1 = require("../infrastructure/grpc/grpc.module");
let SchedulerDomainModule = class SchedulerDomainModule {
};
exports.SchedulerDomainModule = SchedulerDomainModule;
exports.SchedulerDomainModule = SchedulerDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [scheduler_infrastructure_module_1.SchedulerInfrastructureModule, grpc_module_1.GrpcModule],
        providers: [job_processor_1.JobProcessor, job_validator_1.JobValidator, job_scheduler_1.JobScheduler],
        exports: [job_processor_1.JobProcessor, job_validator_1.JobValidator, job_scheduler_1.JobScheduler],
    })
], SchedulerDomainModule);
//# sourceMappingURL=scheduler-domain.module.js.map