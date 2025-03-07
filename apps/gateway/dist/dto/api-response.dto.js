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
exports.HealthCheckResponse = exports.EngineStatusResponse = exports.EngineProcessResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class EngineProcessResponse {
}
exports.EngineProcessResponse = EngineProcessResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was processed successfully',
        example: true,
    }),
    __metadata("design:type", Boolean)
], EngineProcessResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the processed request',
        example: 'req-123456',
    }),
    __metadata("design:type", String)
], EngineProcessResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The result of the processing',
        example: { processed: true, data: { key: 'value' } },
    }),
    __metadata("design:type", Object)
], EngineProcessResponse.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message if processing failed',
        example: 'Failed to process request',
        required: false,
    }),
    __metadata("design:type", String)
], EngineProcessResponse.prototype, "error", void 0);
class EngineStatusResponse {
}
exports.EngineStatusResponse = EngineStatusResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the status check was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], EngineStatusResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the request',
        example: 'req-123456',
    }),
    __metadata("design:type", String)
], EngineStatusResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the request',
        example: 'completed',
        enum: ['pending', 'processing', 'completed', 'failed'],
    }),
    __metadata("design:type", String)
], EngineStatusResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The result of the processing if completed',
        example: { processed: true, data: { key: 'value' } },
        required: false,
    }),
    __metadata("design:type", Object)
], EngineStatusResponse.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message if processing failed',
        example: 'Failed to process request',
        required: false,
    }),
    __metadata("design:type", String)
], EngineStatusResponse.prototype, "error", void 0);
class HealthCheckResponse {
}
exports.HealthCheckResponse = HealthCheckResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The status of the service',
        example: 'ok',
    }),
    __metadata("design:type", String)
], HealthCheckResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current timestamp',
        example: '2025-03-07T13:15:43Z',
    }),
    __metadata("design:type", String)
], HealthCheckResponse.prototype, "timestamp", void 0);
//# sourceMappingURL=api-response.dto.js.map