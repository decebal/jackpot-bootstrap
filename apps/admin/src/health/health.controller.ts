import { Controller, Get } from '@nestjs/common'
import { HealthService } from './health.service'
import { GrpcMethod } from '@nestjs/microservices'

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	async check() {
		return this.healthService.check()
	}

	@GrpcMethod('HealthService', 'Check')
	async grpcCheck() {
		return this.healthService.check()
	}
}
