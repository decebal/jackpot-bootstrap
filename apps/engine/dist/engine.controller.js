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
exports.EngineController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const engine_service_1 = require("./engine.service");
let EngineController = class EngineController {
    constructor(engineService) {
        this.engineService = engineService;
    }
    async processRequest(data) {
        return this.engineService.processRequest(data);
    }
    async getStatus(data) {
        return this.engineService.getStatus(data);
    }
};
exports.EngineController = EngineController;
__decorate([
    (0, microservices_1.GrpcMethod)('EngineService', 'ProcessRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EngineController.prototype, "processRequest", null);
__decorate([
    (0, microservices_1.GrpcMethod)('EngineService', 'GetStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EngineController.prototype, "getStatus", null);
exports.EngineController = EngineController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [engine_service_1.EngineService])
], EngineController);
//# sourceMappingURL=engine.controller.js.map