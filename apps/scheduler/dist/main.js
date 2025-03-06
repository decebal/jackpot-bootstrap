"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const scheduler_module_1 = require("./scheduler.module");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(scheduler_module_1.SchedulerModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const grpcPort = configService.get('GRPC_PORT', 5003);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'scheduler',
            protoPath: (0, path_1.join)(__dirname, '../../../protos/scheduler.proto'),
            url: `0.0.0.0:${grpcPort}`,
        },
    });
    const httpPort = configService.get('HTTP_PORT', 3003);
    await app.startAllMicroservices();
    await app.listen(httpPort);
    console.log(`Scheduler service is running on gRPC port: ${grpcPort}`);
    console.log(`Scheduler service HTTP is running on port: ${httpPort}`);
}
bootstrap();
//# sourceMappingURL=main.js.map