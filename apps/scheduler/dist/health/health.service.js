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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../infrastructure/redis/redis.service");
let HealthService = class HealthService {
    constructor(connection, redisService) {
        this.connection = connection;
        this.redisService = redisService;
    }
    async check() {
        const status = {
            status: 'ok',
            services: {
                database: await this.checkDatabase(),
                redis: await this.checkRedis(),
                scheduler: await this.checkScheduler()
            }
        };
        if (!status.services.database.isHealthy ||
            !status.services.redis.isHealthy ||
            !status.services.scheduler.isHealthy) {
            status.status = 'error';
        }
        return status;
    }
    async checkDatabase() {
        try {
            const isConnected = this.connection.isConnected;
            if (isConnected) {
                await this.connection.query('SELECT 1');
            }
            return {
                isHealthy: isConnected,
                status: isConnected ? 'connected' : 'disconnected'
            };
        }
        catch (error) {
            return {
                isHealthy: false,
                status: 'error',
                error: error.message
            };
        }
    }
    async checkRedis() {
        try {
            const isPingSuccessful = await this.redisService.ping();
            return {
                isHealthy: isPingSuccessful,
                status: isPingSuccessful ? 'connected' : 'disconnected'
            };
        }
        catch (error) {
            return {
                isHealthy: false,
                status: 'error',
                error: error.message
            };
        }
    }
    async checkScheduler() {
        try {
            return {
                isHealthy: true,
                status: 'running',
                activeJobs: 0
            };
        }
        catch (error) {
            return {
                isHealthy: false,
                status: 'error',
                error: error.message
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeorm_2.Connection,
        redis_service_1.RedisService])
], HealthService);
//# sourceMappingURL=health.service.js.map