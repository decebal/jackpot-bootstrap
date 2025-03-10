import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JackpotAPI } from './index'

/**
 * Service for interacting with the Jackpot Gateway API
 * 
 * This service uses the Speakeasy-generated SDK to communicate with the Gateway API
 */
@Injectable()
export class JackpotSDKService {
	private readonly logger = new Logger(JackpotSDKService.name)
	private readonly client: JackpotAPI

	constructor(private configService: ConfigService) {
		// Initialize the SDK client with configuration from environment variables
		this.client = new JackpotAPI({
			serverURL: this.configService.get<string>('GATEWAY_URL') || 'http://localhost:3000',
			security: {
				apiKey: this.configService.get<string>('GATEWAY_API_KEY'),
			},
			retryConfig: {
				maxRetries: 3,
				retryInterval: 1000,
				maxRetryInterval: 10000,
				retryMultiplier: 2,
			},
		})
	}

	/**
	 * Process an engine request
	 * 
	 * @param id Request ID
	 * @param data Request data
	 * @returns Process response
	 */
	async processEngineRequest(id: string, data: any) {
		try {
			this.logger.log(`Processing engine request: ${id}`)
			const response = await this.client.gateway.gatewayControllerProcessEngineRequest({
				requestBody: {
					id,
					data,
				},
			})
			
			return response.processEngineResponse
		} catch (error) {
			this.logger.error(`Error processing engine request: ${error.message}`, error.stack)
			throw error
		}
	}

	/**
	 * Get the status of an engine process
	 * 
	 * @param id Process ID
	 * @returns Status response
	 */
	async getEngineStatus(id: string) {
		try {
			this.logger.log(`Getting engine status: ${id}`)
			const response = await this.client.gateway.gatewayControllerGetEngineStatus(id)
			
			return response.statusResponse
		} catch (error) {
			this.logger.error(`Error getting engine status: ${error.message}`, error.stack)
			throw error
		}
	}

	/**
	 * Check the health of the gateway service
	 * 
	 * @returns Health check response
	 */
	async healthCheck() {
		try {
			this.logger.log('Performing health check')
			const response = await this.client.gateway.gatewayControllerHealthCheck()
			
			return response.healthCheckResponse
		} catch (error) {
			this.logger.error(`Error performing health check: ${error.message}`, error.stack)
			throw error
		}
	}
}
