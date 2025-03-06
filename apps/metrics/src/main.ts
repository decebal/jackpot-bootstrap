import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe, Logger } from '@nestjs/common'
import { join } from 'path'
import { MetricsModule } from './metrics.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const logger = new Logger('MetricsBootstrap')
  
  // Create the NestJS application
  const app = await NestFactory.create(MetricsModule)
  const configService = app.get(ConfigService)
  
  // Get configuration from environment variables with fallbacks
  const grpcPort = configService.get('GRPC_PORT', 5002)
  const httpPort = configService.get('HTTP_PORT', 3002)
  const grpcHost = configService.get('GRPC_HOST', '0.0.0.0')
  
  // Apply global validation pipe for all endpoints
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))
  
  // Connect to the gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'metrics',
      protoPath: join(__dirname, '../../../protos/metrics.proto'),
      url: `${grpcHost}:${grpcPort}`,
    },
  })
  
  // Start the microservice
  await app.startAllMicroservices()
  
  // Start the HTTP server
  await app.listen(httpPort, '0.0.0.0')
  
  logger.log(`Metrics gRPC Microservice running on ${grpcHost}:${grpcPort}`)
  logger.log(`Metrics HTTP Server running on port ${httpPort}`)
}
