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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
let AuditService = class AuditService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async createLogEntry(userId, username, action, resource, resourceId, details, ip, userAgent) {
        const timestamp = new Date().toISOString();
        return this.auditLogRepository.createLogEntry({
            userId,
            username,
            action,
            resource,
            resourceId,
            details,
            timestamp,
            ip,
            userAgent
        });
    }
    async getLogEntries(userId, action, resource, startDate, endDate, limit, offset) {
        return this.auditLogRepository.getLogEntries(userId, action, resource, startDate, endDate, limit, offset);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AUDIT_LOG_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], AuditService);
//# sourceMappingURL=audit.service.js.map