"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const gateway_module_1 = require("./gateway.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(gateway_module_1.GatewayModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Jackpot API')
            .setDescription('The Jackpot B2B platform API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
            .addTag('admin', 'Admin service endpoints')
            .addTag('metrics', 'Metrics service endpoints')
            .addTag('scheduler', 'Scheduler service endpoints')
            .addTag('engine', 'Engine service endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        console.log('Swagger documentation is available at /api/docs');
    }
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Gateway service is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map