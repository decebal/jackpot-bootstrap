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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ApiKeyAuthGuard = class ApiKeyAuthGuard {
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKey(request);
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API key is missing');
        }
        const validApiKey = this.configService.get('API_KEY');
        if (!validApiKey) {
            throw new Error('API_KEY is not configured');
        }
        if (apiKey !== validApiKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        return true;
    }
    extractApiKey(request) {
        const headerKey = request.header('X-API-Key');
        if (headerKey) {
            return headerKey;
        }
        const queryKey = request.query['api_key'];
        if (typeof queryKey === 'string') {
            return queryKey;
        }
        return undefined;
    }
};
exports.ApiKeyAuthGuard = ApiKeyAuthGuard;
exports.ApiKeyAuthGuard = ApiKeyAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ApiKeyAuthGuard);
//# sourceMappingURL=api-key-auth.guard.js.map