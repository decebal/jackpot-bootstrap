"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineDomainModule = void 0;
const common_1 = require("@nestjs/common");
const engine_processor_1 = require("./engine.processor");
const engine_validator_1 = require("./engine.validator");
let EngineDomainModule = class EngineDomainModule {
};
exports.EngineDomainModule = EngineDomainModule;
exports.EngineDomainModule = EngineDomainModule = __decorate([
    (0, common_1.Module)({
        providers: [engine_processor_1.EngineProcessor, engine_validator_1.EngineValidator],
        exports: [engine_processor_1.EngineProcessor],
    })
], EngineDomainModule);
//# sourceMappingURL=engine-domain.module.js.map