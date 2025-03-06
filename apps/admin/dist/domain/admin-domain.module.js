"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDomainModule = void 0;
const common_1 = require("@nestjs/common");
const admin_infrastructure_module_1 = require("../infrastructure/admin-infrastructure.module");
const user_service_1 = require("./user.service");
const auth_service_1 = require("./auth.service");
const audit_service_1 = require("./audit.service");
let AdminDomainModule = class AdminDomainModule {
};
exports.AdminDomainModule = AdminDomainModule;
exports.AdminDomainModule = AdminDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [admin_infrastructure_module_1.AdminInfrastructureModule],
        providers: [
            user_service_1.UserService,
            auth_service_1.AuthService,
            audit_service_1.AuditService,
            {
                provide: 'USER_REPOSITORY',
                useExisting: 'USER_REPOSITORY_IMPL'
            },
            {
                provide: 'AUDIT_LOG_REPOSITORY',
                useExisting: 'AUDIT_LOG_REPOSITORY_IMPL'
            },
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService
            }
        ],
        exports: [
            'USER_REPOSITORY',
            'AUDIT_LOG_REPOSITORY',
            'AUTH_SERVICE',
            user_service_1.UserService,
            auth_service_1.AuthService,
            audit_service_1.AuditService
        ]
    })
], AdminDomainModule);
//# sourceMappingURL=admin-domain.module.js.map