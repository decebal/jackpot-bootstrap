import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EngineModule } from './engine.module';

async function bootstrap() {
  // Create the microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EngineModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'engine',
        protoPath: join(__dirname, '../../../protos/engine.proto'),
        url: '0.0.0.0:5000',
      },
    },
  );

  // Optional: Create an HTTP server for health checks
  const httpApp = await NestFactory.create(EngineModule);
  await httpApp.listen(3000);

  await app.listen();
  console.log('Engine Microservice is running');
}
