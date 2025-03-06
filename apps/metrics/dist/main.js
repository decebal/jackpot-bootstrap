"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const metrics_module_1 = require("./metrics.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const logger = new common_1.Logger('MetricsBootstrap');
    const app = await core_1.NestFactory.create(metrics_module_1.MetricsModule);
    const configService = app.get(config_1.ConfigService);
    const grpcPort = configService.get('GRPC_PORT', 5002);
    const httpPort = configService.get('HTTP_PORT', 3002);
    const grpcHost = configService.get('GRPC_HOST', '0.0.0.0');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'metrics',
            protoPath: (0, path_1.join)(__dirname, '../../../protos/metrics.proto'),
            url: `${grpcHost}:${grpcPort}`,
        },
    });
    await app.startAllMicroservices();
    await app.listen(httpPort, '0.0.0.0');
    logger.log(`Metrics gRPC Microservice running on ${grpcHost}:${grpcPort}`);
    logger.log(`Metrics HTTP Server running on port ${httpPort}`);
}
//# sourceMappingURL=main.js.map