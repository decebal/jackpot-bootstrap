import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'ENGINE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'engine',
          protoPath: join(__dirname, '../../../protos/engine.proto'),
          url: process.env.ENGINE_SERVICE_URL || 'engine-service:5000',
        },
      },
      {
        name: 'METRICS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'metrics',
          protoPath: join(__dirname, '../../../protos/metrics.proto'),
          url: process.env.METRICS_SERVICE_URL || 'metrics-service:5000',
        },
      },
      {
        name: 'SCHEDULER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'scheduler',
          protoPath: join(__dirname, '../../../protos/scheduler.proto'),
          url: process.env.SCHEDULER_SERVICE_URL || 'scheduler-service:5000',
        },
      },
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'admin',
          protoPath: join(__dirname, '../../../protos/admin.proto'),
          url: process.env.ADMIN_SERVICE_URL || 'admin-service:5000',
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    ApiKeyAuthGuard,
    {
      provide: 'APP_GUARD',
      useClass: ApiKeyAuthGuard,
    },
  ],
})
export class GatewayModule {}
