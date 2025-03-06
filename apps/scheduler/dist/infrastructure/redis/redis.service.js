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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    constructor(redisOptions) {
        this.redisOptions = redisOptions;
    }
    onModuleInit() {
        this.redisClient = new ioredis_1.Redis({
            host: this.redisOptions.host,
            port: this.redisOptions.port,
            lazyConnect: true,
            retryStrategy: (times) => {
                return Math.min(times * 1000, 30000);
            }
        });
        this.redisClient.on('error', (error) => {
            console.error('Redis connection error:', error);
        });
        this.redisClient.on('connect', () => {
            console.log(`Connected to Redis at ${this.redisOptions.host}:${this.redisOptions.port}`);
        });
        return this.redisClient.connect();
    }
    onModuleDestroy() {
        return this.redisClient.quit();
    }
    async get(key) {
        return this.redisClient.get(key);
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.redisClient.set(key, value, 'EX', ttl);
        }
        else {
            await this.redisClient.set(key, value);
        }
    }
    async del(key) {
        await this.redisClient.del(key);
    }
    async keys(pattern) {
        return this.redisClient.keys(pattern);
    }
    async ttl(key) {
        return this.redisClient.ttl(key);
    }
    async exists(key) {
        const result = await this.redisClient.exists(key);
        return result === 1;
    }
    async ping() {
        try {
            const result = await this.redisClient.ping();
            return result === 'PONG';
        }
        catch (error) {
            console.error('Redis ping error:', error);
            return false;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map