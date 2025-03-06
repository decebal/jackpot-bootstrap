"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const gateway_controller_1 = require("./gateway.controller");
const gateway_service_1 = require("./gateway.service");
const api_key_auth_guard_1 = require("./guards/api-key-auth.guard");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            microservices_1.ClientsModule.register([
                {
                    name: 'ENGINE_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'engine',
                        protoPath: (0, path_1.join)(__dirname, '../../../protos/engine.proto'),
                        url: process.env.ENGINE_SERVICE_URL || 'engine-service:5000',
                    },
                },
                {
                    name: 'METRICS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'metrics',
                        protoPath: (0, path_1.join)(__dirname, '../../../protos/metrics.proto'),
                        url: process.env.METRICS_SERVICE_URL || 'metrics-service:5000',
                    },
                },
                {
                    name: 'SCHEDULER_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'scheduler',
                        protoPath: (0, path_1.join)(__dirname, '../../../protos/scheduler.proto'),
                        url: process.env.SCHEDULER_SERVICE_URL || 'scheduler-service:5000',
                    },
                },
                {
                    name: 'ADMIN_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'admin',
                        protoPath: (0, path_1.join)(__dirname, '../../../protos/admin.proto'),
                        url: process.env.ADMIN_SERVICE_URL || 'admin-service:5000',
                    },
                },
            ]),
        ],
        controllers: [gateway_controller_1.GatewayController],
        providers: [
            gateway_service_1.GatewayService,
            api_key_auth_guard_1.ApiKeyAuthGuard,
            {
                provide: 'APP_GUARD',
                useClass: api_key_auth_guard_1.ApiKeyAuthGuard,
            },
        ],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map