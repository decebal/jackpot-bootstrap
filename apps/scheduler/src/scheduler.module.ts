import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SchedulerController } from './scheduler.controller'
import { SchedulerService } from './scheduler.service'
import { SchedulerDomainModule } from './domain/scheduler-domain.module'
import { SchedulerInfrastructureModule } from './infrastructure/scheduler-infrastructure.module'
import { HealthModule } from './health/health.module'
import { join } from 'path'

@Module({
	imports: [
		// Configuration
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		
		// Database connection
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get('DATABASE_HOST', 'localhost'),
				port: configService.get('DATABASE_PORT', 3306),
				username: configService.get('DATABASE_USERNAME', 'root'),
				password: configService.get('DATABASE_PASSWORD', 'password'),
				database: configService.get('DATABASE_NAME', 'jackpot'),
				entities: [join(__dirname, '**/*.entity{.ts,.js}')],
				synchronize: configService.get('NODE_ENV', 'development') !== 'production',
				logging: configService.get('NODE_ENV', 'development') !== 'production',
			}),
		}),
		
		// gRPC clients
		ClientsModule.registerAsync([
			{
				name: 'METRICS_PACKAGE',
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: 'metrics',
						protoPath: join(__dirname, '../../../protos/metrics.proto'),
						url: `${configService.get('METRICS_HOST', 'localhost')}:${configService.get('METRICS_PORT', 5002)}`,
					},
				}),
			},
		]),
		
		// Domain modules
		SchedulerDomainModule,
		
		// Infrastructure module
		SchedulerInfrastructureModule,
		
		// Health module
		HealthModule,
	],
	controllers: [SchedulerController],
	providers: [SchedulerService],
	exports: [],
})
export class SchedulerModule {}
