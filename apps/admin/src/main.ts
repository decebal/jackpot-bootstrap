import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { AdminModule } from './admin.module'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

async function bootstrap() {
	const app = await NestFactory.create(AdminModule)
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
	const grpcPort = configService.get<number>('GRPC_PORT', 5004)
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: 'admin',
			protoPath: join(__dirname, '../../protos/admin.proto'),
			url: `0.0.0.0:${grpcPort}`,
		},
	})
	
	// Configure HTTP server with CORS enabled for admin frontend
	const httpPort = configService.get<number>('HTTP_PORT', 3004)
	app.enableCors({
		origin: configService.get('ADMIN_FRONTEND_URL', '*'),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
	
	// Start microservices
	await app.startAllMicroservices()
	
	// Start HTTP server
	await app.listen(httpPort)
	
	console.log(`Admin service is running on gRPC port: ${grpcPort}`)
	console.log(`Admin service HTTP is running on port: ${httpPort}`)
}

bootstrap()
