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
exports.MetricsProcessor = void 0;
const common_1 = require("@nestjs/common");
const metrics_validator_1 = require("./metrics.validator");
const uuid_1 = require("uuid");
let MetricsProcessor = class MetricsProcessor {
    constructor(validator) {
        this.validator = validator;
    }
    async processMetrics(request) {
        await this.validator.validateMetricsRequest(request);
        return this.transformMetricsData(request);
    }
    transformMetricsData(request) {
        const timestamp = request.timestamp || new Date().toISOString();
        return {
            id: (0, uuid_1.v4)(),
            source: request.source,
            event_type: request.event_type,
            data: request.data,
            timestamp
        };
    }
};
exports.MetricsProcessor = MetricsProcessor;
exports.MetricsProcessor = MetricsProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_validator_1.MetricsValidator])
], MetricsProcessor);
//# sourceMappingURL=metrics.processor.js.map