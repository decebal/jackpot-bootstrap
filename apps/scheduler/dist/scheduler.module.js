"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const microservices_1 = require("@nestjs/microservices");
const scheduler_controller_1 = require("./scheduler.controller");
const scheduler_service_1 = require("./scheduler.service");
const scheduler_domain_module_1 = require("./domain/scheduler-domain.module");
const health_module_1 = require("./health/health.module");
const path_1 = require("path");
let SchedulerModule = class SchedulerModule {
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DATABASE_HOST', 'localhost'),
                    port: configService.get('DATABASE_PORT', 3306),
                    username: configService.get('DATABASE_USERNAME', 'root'),
                    password: configService.get('DATABASE_PASSWORD', 'password'),
                    database: configService.get('DATABASE_NAME', 'jackpot'),
                    entities: [(0, path_1.join)(__dirname, '**/*.entity{.ts,.js}')],
                    synchronize: configService.get('NODE_ENV', 'development') !== 'production',
                    logging: configService.get('NODE_ENV', 'development') !== 'production',
                }),
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'METRICS_PACKAGE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: 'metrics',
                            protoPath: (0, path_1.join)(__dirname, '../../protos/metrics.proto'),
                            url: `${configService.get('METRICS_HOST', 'localhost')}:${configService.get('METRICS_PORT', 5002)}`,
                        },
                    }),
                },
            ]),
            scheduler_domain_module_1.SchedulerDomainModule,
            health_module_1.HealthModule,
        ],
        controllers: [scheduler_controller_1.SchedulerController],
        providers: [scheduler_service_1.SchedulerService],
    })
], SchedulerModule);
//# sourceMappingURL=scheduler.module.js.map