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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(RedisService_1.name);
    }
    async get(key) {
        try {
            return await this.redisClient.get(key);
        }
        catch (error) {
            this.logger.error(`Error getting key ${key} from Redis: ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        try {
            if (ttlSeconds) {
                await this.redisClient.set(key, value, 'EX', ttlSeconds);
            }
            else {
                await this.redisClient.set(key, value);
            }
        }
        catch (error) {
            this.logger.error(`Error setting key ${key} in Redis: ${error.message}`);
        }
    }
    async delete(key) {
        try {
            await this.redisClient.del(key);
        }
        catch (error) {
            this.logger.error(`Error deleting key ${key} from Redis: ${error.message}`);
        }
    }
    async deleteByPattern(pattern) {
        try {
            const keys = await this.redisClient.keys(pattern);
            if (keys.length > 0) {
                await this.redisClient.del(...keys);
            }
        }
        catch (error) {
            this.logger.error(`Error deleting keys by pattern ${pattern} from Redis: ${error.message}`);
        }
    }
    async increment(key, value = 1) {
        try {
            return await this.redisClient.incrby(key, value);
        }
        catch (error) {
            this.logger.error(`Error incrementing key ${key} in Redis: ${error.message}`);
            return 0;
        }
    }
    async expire(key, ttlSeconds) {
        try {
            await this.redisClient.expire(key, ttlSeconds);
        }
        catch (error) {
            this.logger.error(`Error setting expiry for key ${key} in Redis: ${error.message}`);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], RedisService);
//# sourceMappingURL=redis.service.js.map