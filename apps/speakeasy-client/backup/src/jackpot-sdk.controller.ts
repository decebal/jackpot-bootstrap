import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger'
import { JackpotSDKService } from './jackpot-sdk.service'

/**
 * Controller for the Jackpot SDK client
 * 
 * This controller exposes endpoints that demonstrate the usage of the
 * Speakeasy-generated SDK for the Jackpot Gateway API
 */
@ApiTags('jackpot-sdk')
@Controller('api/v1')
export class JackpotSDKController {
	constructor(private readonly jackpotSDKService: JackpotSDKService) {}

	/**
	 * Process an engine request
	 */
	@Post('engine/process')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Process an engine request' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id: { type: 'string', example: 'request-123' },
				data: { 
					type: 'object',
					example: { key: 'value' }
				}
			}
		}
	})
	@ApiResponse({ status: HttpStatus.OK, description: 'Request processed successfully' })
	async processEngineRequest(@Body() body: { id: string; data: any }) {
		return this.jackpotSDKService.processEngineRequest(body.id, body.data)
	}

	/**
	 * Get engine process status
	 */
	@Get('engine/status/:id')
	@ApiOperation({ summary: 'Get engine process status' })
	@ApiParam({ name: 'id', description: 'Process ID' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Status retrieved successfully' })
	async getEngineStatus(@Param('id') id: string) {
		return this.jackpotSDKService.getEngineStatus(id)
	}

	/**
	 * Health check
	 */
	@Get('health')
	@ApiOperation({ summary: 'Health check' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Service is healthy' })
	async healthCheck() {
		return this.jackpotSDKService.healthCheck()
	}
}
