"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const engine_module_1 = require("./engine.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(engine_module_1.EngineModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'engine',
            protoPath: (0, path_1.join)(__dirname, '../../../protos/engine.proto'),
            url: '0.0.0.0:5000',
        },
    });
    const httpApp = await core_1.NestFactory.create(engine_module_1.EngineModule);
    await httpApp.listen(3000);
    await app.listen();
    console.log('Engine Microservice is running');
}
//# sourceMappingURL=main.js.map