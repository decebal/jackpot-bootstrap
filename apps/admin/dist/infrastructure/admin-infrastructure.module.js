"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const user_repository_1 = require("./repositories/user.repository");
const audit_log_repository_1 = require("./repositories/audit-log.repository");
let AdminInfrastructureModule = class AdminInfrastructureModule {
};
exports.AdminInfrastructureModule = AdminInfrastructureModule;
exports.AdminInfrastructureModule = AdminInfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                audit_log_entity_1.AuditLogEntity
            ])
        ],
        providers: [
            {
                provide: 'USER_REPOSITORY_IMPL',
                useClass: user_repository_1.UserRepository
            },
            {
                provide: 'AUDIT_LOG_REPOSITORY_IMPL',
                useClass: audit_log_repository_1.AuditLogRepository
            }
        ],
        exports: [
            'USER_REPOSITORY_IMPL',
            'AUDIT_LOG_REPOSITORY_IMPL'
        ]
    })
], AdminInfrastructureModule);
//# sourceMappingURL=admin-infrastructure.module.js.map