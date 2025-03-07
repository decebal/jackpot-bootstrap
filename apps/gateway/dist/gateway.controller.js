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
exports.GatewayController = void 0;
const common_1 = require("@nestjs/common");
const gateway_service_1 = require("./gateway.service");
const process_request_dto_1 = require("./dto/process-request.dto");
const swagger_1 = require("@nestjs/swagger");
const api_response_dto_1 = require("./dto/api-response.dto");
let GatewayController = class GatewayController {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    async processEngineRequest(request) {
        return this.gatewayService.processEngineRequest(request);
    }
    async getEngineStatus(id) {
        return this.gatewayService.getEngineStatus(id);
    }
    async healthCheck() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Process an engine request', description: 'Sends a request to the engine service for processing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request processed successfully', type: api_response_dto_1.EngineProcessResponse }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error or engine service unavailable' }),
    (0, common_1.Post)('engine/process'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_request_dto_1.ProcessRequestDto]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "processEngineRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get engine process status', description: 'Retrieves the status of a previously submitted engine process request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the process request to check', example: 'req-123456' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status retrieved successfully', type: api_response_dto_1.EngineStatusResponse }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Process request not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error or engine service unavailable' }),
    (0, common_1.Get)('engine/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "getEngineStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Health check', description: 'Check if the API gateway is running properly' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy', type: api_response_dto_1.HealthCheckResponse }),
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "healthCheck", null);
exports.GatewayController = GatewayController = __decorate([
    (0, swagger_1.ApiTags)('gateway'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map