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
exports.AuditLogRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogRepository = class AuditLogRepository {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async createLogEntry(entry) {
        const auditLogEntity = this.auditLogRepository.create({
            ...entry,
            timestamp: new Date(entry.timestamp)
        });
        const savedLog = await this.auditLogRepository.save(auditLogEntity);
        return this.mapEntityToDomain(savedLog);
    }
    async getLogEntries(userId, action, resource, startDate, endDate, limit, offset) {
        const whereClause = {};
        if (userId) {
            whereClause.userId = userId;
        }
        if (action) {
            whereClause.action = action;
        }
        if (resource) {
            whereClause.resource = resource;
        }
        if (startDate && endDate) {
            whereClause.timestamp = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate));
        }
        else if (startDate) {
            whereClause.timestamp = (0, typeorm_2.Between)(new Date(startDate), new Date());
        }
        else if (endDate) {
            whereClause.timestamp = (0, typeorm_2.Between)(new Date(0), new Date(endDate));
        }
        const [logs, total] = await this.auditLogRepository.findAndCount({
            where: whereClause,
            take: limit || 50,
            skip: offset || 0,
            order: {
                timestamp: 'DESC'
            }
        });
        return {
            logs: logs.map(log => this.mapEntityToDomain(log)),
            total
        };
    }
    mapEntityToDomain(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            username: entity.username,
            action: entity.action,
            resource: entity.resource,
            resourceId: entity.resourceId,
            details: entity.details,
            timestamp: entity.timestamp.toISOString(),
            ip: entity.ip,
            userAgent: entity.userAgent
        };
    }
};
exports.AuditLogRepository = AuditLogRepository;
exports.AuditLogRepository = AuditLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogRepository);
//# sourceMappingURL=audit-log.repository.js.map