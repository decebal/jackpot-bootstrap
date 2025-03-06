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
exports.MetricsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const metrics_entity_1 = require("../entities/metrics.entity");
const redis_service_1 = require("../redis/redis.service");
let MetricsRepository = class MetricsRepository {
    constructor(metricsRepository, redisService) {
        this.metricsRepository = metricsRepository;
        this.redisService = redisService;
        this.CACHE_TTL = 60 * 5;
        this.CACHE_PREFIX = 'metrics:';
    }
    async saveMetric(metric) {
        const savedMetric = await this.metricsRepository.save(metric);
        await this.invalidateCache(metric.source, metric.event_type);
        return savedMetric;
    }
    async getMetrics(source, eventType, startDate, endDate, limit, offset) {
        const cacheKey = this.generateCacheKey(source, eventType, startDate, endDate, limit, offset);
        const cachedResult = await this.redisService.get(cacheKey);
        if (cachedResult) {
            return JSON.parse(cachedResult);
        }
        const whereClause = {};
        if (source) {
            whereClause.source = source;
        }
        if (eventType) {
            whereClause.event_type = eventType;
        }
        if (startDate && endDate) {
            whereClause.timestamp = (0, typeorm_2.Between)(startDate, endDate);
        }
        const total = await this.metricsRepository.count({ where: whereClause });
        const metrics = await this.metricsRepository.find({
            where: whereClause,
            take: limit,
            skip: offset,
            order: { timestamp: 'DESC' }
        });
        const result = { metrics, total };
        await this.redisService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
        return result;
    }
    async getMetricById(id) {
        const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
        const cachedMetric = await this.redisService.get(cacheKey);
        if (cachedMetric) {
            return JSON.parse(cachedMetric);
        }
        const metric = await this.metricsRepository.findOne({ where: { id } });
        if (metric) {
            await this.redisService.set(cacheKey, JSON.stringify(metric), this.CACHE_TTL);
        }
        return metric || null;
    }
    generateCacheKey(source, eventType, startDate, endDate, limit, offset) {
        return `${this.CACHE_PREFIX}list:${source}:${eventType}:${startDate}:${endDate}:${limit}:${offset}`;
    }
    async invalidateCache(source, eventType) {
        const pattern = `${this.CACHE_PREFIX}list:${source}:${eventType}:*`;
        await this.redisService.deleteByPattern(pattern);
        const generalPattern = `${this.CACHE_PREFIX}list::*`;
        await this.redisService.deleteByPattern(generalPattern);
    }
};
exports.MetricsRepository = MetricsRepository;
exports.MetricsRepository = MetricsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(metrics_entity_1.MetricsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService])
], MetricsRepository);
//# sourceMappingURL=metrics.repository.js.map