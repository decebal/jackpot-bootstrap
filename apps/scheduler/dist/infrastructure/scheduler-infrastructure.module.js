"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerInfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_entity_1 = require("./entities/job.entity");
const job_repository_1 = require("./repositories/job.repository");
const redis_module_1 = require("./redis/redis.module");
let SchedulerInfrastructureModule = class SchedulerInfrastructureModule {
};
exports.SchedulerInfrastructureModule = SchedulerInfrastructureModule;
exports.SchedulerInfrastructureModule = SchedulerInfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([job_entity_1.JobEntity]),
            redis_module_1.RedisModule
        ],
        providers: [job_repository_1.JobRepository],
        exports: [job_repository_1.JobRepository, redis_module_1.RedisModule],
    })
], SchedulerInfrastructureModule);
//# sourceMappingURL=scheduler-infrastructure.module.js.map