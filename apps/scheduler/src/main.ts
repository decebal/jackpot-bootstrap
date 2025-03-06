import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { SchedulerModule } from './scheduler.module'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

async function bootstrap() {
	const app = await NestFactory.create(SchedulerModule)
	const configService = app.get(ConfigService)
	
	// Apply global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
		})
	)
	
	// Configure gRPC microservice
	const grpcPort = configService.get<number>('GRPC_PORT', 5003)
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: 'scheduler',
			protoPath: join(__dirname, '../../protos/scheduler.proto'),
			url: `0.0.0.0:${grpcPort}`,
		},
	})
	
	// Configure HTTP server
	const httpPort = configService.get<number>('HTTP_PORT', 3003)
	
	// Start microservices
	await app.startAllMicroservices()
	
	// Start HTTP server
	await app.listen(httpPort)
	
	console.log(`Scheduler service is running on gRPC port: ${grpcPort}`)
	console.log(`Scheduler service HTTP is running on port: ${httpPort}`)
}

bootstrap()
