"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineValidator = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
let EngineValidator = class EngineValidator {
    constructor() {
        this.requestSchema = zod_1.z.object({
            id: zod_1.z.string(),
            data: zod_1.z.any(),
            timestamp: zod_1.z.string().datetime().optional(),
        });
    }
    async validateRequest(data) {
        return this.requestSchema.parseAsync(data);
    }
};
exports.EngineValidator = EngineValidator;
exports.EngineValidator = EngineValidator = __decorate([
    (0, common_1.Injectable)()
], EngineValidator);
//# sourceMappingURL=engine.validator.js.map