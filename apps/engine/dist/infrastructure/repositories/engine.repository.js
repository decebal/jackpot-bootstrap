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
exports.EngineRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const engine_entity_1 = require("../entities/engine.entity");
let EngineRepository = class EngineRepository {
    constructor(repository, redisService) {
        this.repository = repository;
        this.redisService = redisService;
        this.CACHE_TTL = 3600;
        this.CACHE_PREFIX = 'engine:';
    }
    async save(data) {
        const entity = this.repository.create({
            id: data.id,
            status: data.status,
            result: data.result,
            data: {}
        });
        await this.repository.save(entity);
        await this.redisService.set(this.getCacheKey(data.id), JSON.stringify(data), this.CACHE_TTL);
    }
    async getStatus(id) {
        const cached = await this.redisService.get(this.getCacheKey(id));
        if (cached) {
            return JSON.parse(cached);
        }
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            throw new Error(`No request found with id ${id}`);
        }
        const response = {
            id: entity.id,
            status: entity.status,
            result: entity.result,
            timestamp: entity.updatedAt.toISOString(),
        };
        await this.redisService.set(this.getCacheKey(id), JSON.stringify(response), this.CACHE_TTL);
        return response;
    }
    getCacheKey(id) {
        return `${this.CACHE_PREFIX}${id}`;
    }
};
exports.EngineRepository = EngineRepository;
exports.EngineRepository = EngineRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(engine_entity_1.EngineEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService])
], EngineRepository);
//# sourceMappingURL=engine.repository.js.map