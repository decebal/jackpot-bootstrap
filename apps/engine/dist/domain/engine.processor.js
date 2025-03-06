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
exports.EngineProcessor = void 0;
const common_1 = require("@nestjs/common");
const engine_validator_1 = require("./engine.validator");
let EngineProcessor = class EngineProcessor {
    constructor(validator) {
        this.validator = validator;
    }
    async process(request) {
        await this.validator.validateRequest(request);
        const processedData = await this.processRequest(request);
        return {
            id: processedData.id,
            status: processedData.status,
            result: processedData.result,
            timestamp: new Date().toISOString(),
        };
    }
    async processRequest(request) {
        const { data } = request;
        return {
            id: request.id,
            status: 'completed',
            result: data,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.EngineProcessor = EngineProcessor;
exports.EngineProcessor = EngineProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [engine_validator_1.EngineValidator])
], EngineProcessor);
//# sourceMappingURL=engine.processor.js.map