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
const redis_constants_1 = require("./redis.constants");
let RedisService = class RedisService {
    constructor(config) {
        this.config = config;
    }
    async onModuleInit() {
        this.client = new ioredis_1.default({
            host: this.config.host,
            port: this.config.port,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });
        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (err) {
            console.error('Redis Get Error:', err);
            throw err;
        }
    }
    async set(key, value, ttlSeconds) {
        try {
            if (ttlSeconds) {
                await this.client.setex(key, ttlSeconds, value);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (err) {
            console.error('Redis Set Error:', err);
            throw err;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (err) {
            console.error('Redis Delete Error:', err);
            throw err;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CONFIG)),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map