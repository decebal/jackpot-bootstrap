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
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const metrics_entity_1 = require("../infrastructure/entities/metrics.entity");
const redis_service_1 = require("../infrastructure/redis/redis.service");
let HealthService = HealthService_1 = class HealthService {
    constructor(metricsRepository, redisService) {
        this.metricsRepository = metricsRepository;
        this.redisService = redisService;
        this.logger = new common_1.Logger(HealthService_1.name);
    }
    async check() {
        const status = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                database: await this.checkDatabase(),
                redis: await this.checkRedis(),
            }
        };
        if (status.services.database.status !== 'ok' ||
            status.services.redis.status !== 'ok') {
            status.status = 'error';
        }
        return status;
    }
    async checkDatabase() {
        try {
            await this.metricsRepository.query('SELECT 1');
            return { status: 'ok' };
        }
        catch (error) {
            this.logger.error(`Database health check failed: ${error.message}`, error.stack);
            return {
                status: 'error',
                message: 'Database connection failed'
            };
        }
    }
    async checkRedis() {
        try {
            const pingResult = await this.redisService.get('health:ping');
            await this.redisService.set('health:ping', 'pong', 60);
            return { status: 'ok' };
        }
        catch (error) {
            this.logger.error(`Redis health check failed: ${error.message}`, error.stack);
            return {
                status: 'error',
                message: 'Redis connection failed'
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(metrics_entity_1.MetricsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService])
], HealthService);
//# sourceMappingURL=health.service.js.map