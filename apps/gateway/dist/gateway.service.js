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
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let GatewayService = class GatewayService {
    constructor(engineClient) {
        this.engineClient = engineClient;
    }
    onModuleInit() {
        this.engineService = this.engineClient.getService('EngineService');
    }
    async processEngineRequest(request) {
        try {
            const grpcRequest = {
                id: request.id,
                data: Buffer.from(JSON.stringify(request.data)),
                timestamp: request.timestamp || new Date().toISOString(),
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.engineService.processRequest(grpcRequest));
            if (response.result instanceof Buffer) {
                response.result = JSON.parse(response.result.toString());
            }
            return response;
        }
        catch (error) {
            console.error('Engine Process Request Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to process request',
            };
        }
    }
    async getEngineStatus(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.engineService.getStatus({ id }));
            if (response.result instanceof Buffer) {
                response.result = JSON.parse(response.result.toString());
            }
            return response;
        }
        catch (error) {
            console.error('Engine Status Request Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get status',
            };
        }
    }
};
exports.GatewayService = GatewayService;
exports.GatewayService = GatewayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ENGINE_SERVICE')),
    __metadata("design:paramtypes", [Object])
], GatewayService);
//# sourceMappingURL=gateway.service.js.map