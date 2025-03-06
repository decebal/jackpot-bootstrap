"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const redis_module_1 = require("./infrastructure/redis/redis.module");
const engine_controller_1 = require("./engine.controller");
const engine_service_1 = require("./engine.service");
const engine_domain_module_1 = require("./domain/engine-domain.module");
const engine_infra_module_1 = require("./infrastructure/engine-infra.module");
let EngineModule = class EngineModule {
};
exports.EngineModule = EngineModule;
exports.EngineModule = EngineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DATABASE_HOST', 'mysql-service'),
                    port: configService.get('DATABASE_PORT', 3306),
                    username: configService.get('DATABASE_USER'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                }),
                inject: [config_1.ConfigService],
            }),
            redis_module_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    host: configService.get('REDIS_HOST', 'redis-engine'),
                    port: configService.get('REDIS_PORT', 6379),
                }),
                inject: [config_1.ConfigService],
            }),
            engine_domain_module_1.EngineDomainModule,
            engine_infra_module_1.EngineInfraModule,
        ],
        controllers: [engine_controller_1.EngineController],
        providers: [engine_service_1.EngineService],
    })
], EngineModule);
//# sourceMappingURL=engine.module.js.map