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
const ioredis_1 = require("ioredis");
const common_2 = require("@nestjs/common");
let HealthService = class HealthService {
    constructor(dataSource, redisClient) {
        this.dataSource = dataSource;
        this.redisClient = redisClient;
    }
    async check() {
        const status = {
            status: 'ok',
            services: {
                database: await this.checkDatabase(),
                redis: await this.checkRedis(),
            }
        };
        if (Object.values(status.services).some(service => service.status === 'error')) {
            status.status = 'error';
        }
        return status;
    }
    async checkDatabase() {
        try {
            if (!this.dataSource.isInitialized) {
                return { status: 'error', message: 'Database connection not initialized' };
            }
            await this.dataSource.query('SELECT 1');
            return { status: 'ok' };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
    async checkRedis() {
        try {
            await this.redisClient.ping();
            return { status: 'ok' };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, common_2.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        ioredis_1.Redis])
], HealthService);
//# sourceMappingURL=health.service.js.map