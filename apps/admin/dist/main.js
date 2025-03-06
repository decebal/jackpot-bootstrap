"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const admin_module_1 = require("./admin.module");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(admin_module_1.AdminModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const grpcPort = configService.get('GRPC_PORT', 5004);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'admin',
            protoPath: (0, path_1.join)(__dirname, '../../../protos/admin.proto'),
            url: `0.0.0.0:${grpcPort}`,
        },
    });
    const httpPort = configService.get('HTTP_PORT', 3004);
    app.enableCors({
        origin: configService.get('ADMIN_FRONTEND_URL', '*'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.startAllMicroservices();
    await app.listen(httpPort);
    console.log(`Admin service is running on gRPC port: ${grpcPort}`);
    console.log(`Admin service HTTP is running on port: ${httpPort}`);
}
bootstrap();
//# sourceMappingURL=main.js.map