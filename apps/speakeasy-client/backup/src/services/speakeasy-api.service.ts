import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Speakeasy } from 'speakeasy-api'
import { 
	SpeakeasyRequestCapture, 
	SpeakeasyEndpoint, 
	ApiMetricsFilters, 
	ApiSchema,
	ApiMetrics
} from '../interfaces/speakeasy-api.interface'

@Injectable()
export class SpeakeasyApiService {
	private readonly logger = new Logger(SpeakeasyApiService.name)
	private speakeasyClient: Speakeasy

	constructor(private configService: ConfigService) {
		// Initialize the Speakeasy SDK client
		this.initializeSpeakeasyClient()
	}

	private initializeSpeakeasyClient() {
		const apiKey = this.configService.get<string>('SPEAKEASY_API_KEY')
		const apiId = this.configService.get<string>('SPEAKEASY_API_ID')
		const baseUrl = this.configService.get<string>('SPEAKEASY_BASE_URL')

		if (!apiKey || !apiId) {
			this.logger.warn('Speakeasy API key or API ID not configured. Some functionality may be limited.')
			return
		}

		try {
			this.speakeasyClient = new Speakeasy({
				apiKey,
				apiID: apiId,
				baseUrl: baseUrl || undefined,
			})
			
			this.logger.log('Speakeasy API client initialized successfully')
		} catch (error) {
			this.logger.error(`Failed to initialize Speakeasy API client: ${error.message}`, error.stack)
			throw error
		}
	}

	/**
	 * Get the Speakeasy SDK client instance
	 */
	getClient(): Speakeasy {
		if (!this.speakeasyClient) {
			this.logger.warn('Attempting to use Speakeasy client before initialization')
			this.initializeSpeakeasyClient()
			
			if (!this.speakeasyClient) {
				throw new Error('Speakeasy client is not initialized')
			}
		}
		
		return this.speakeasyClient
	}

	/**
	 * Capture an API request for analysis
	 * @param request The request object
	 * @param response The response object
	 * @param metadata Additional metadata for the request
	 */
	async captureRequest(
		request: Record<string, any>, 
		response: Record<string, any>, 
		metadata?: Record<string, any>
	): Promise<boolean> {
		try {
			const client = this.getClient()
			const captureData: SpeakeasyRequestCapture = {
				request,
				response,
				metadata,
			}
			
			await client.captureRequest(captureData)
			
			this.logger.debug('API request captured by Speakeasy')
			return true
		} catch (error) {
			this.logger.error(`Failed to capture API request: ${error.message}`, error.stack)
			return false
		}
	}

	/**
	 * Get API schemas from Speakeasy
	 */
	async getApiSchemas(): Promise<ApiSchema[]> {
		try {
			const client = this.getClient()
			const schemas = await client.getApiSchemas()
			
			return schemas as ApiSchema[]
		} catch (error) {
			this.logger.error(`Failed to get API schemas: ${error.message}`, error.stack)
			throw error
		}
	}

	/**
	 * Get API metrics from Speakeasy
	 * @param filters Optional filters for the metrics
	 */
	async getApiMetrics(filters?: ApiMetricsFilters): Promise<ApiMetrics> {
		try {
			const client = this.getClient()
			const metrics = await client.getApiMetrics(filters)
			
			return metrics as ApiMetrics
		} catch (error) {
			this.logger.error(`Failed to get API metrics: ${error.message}`, error.stack)
			throw error
		}
	}

	/**
	 * Register a new API endpoint with Speakeasy
	 * @param endpoint The endpoint information
	 */
	async registerEndpoint(endpoint: SpeakeasyEndpoint): Promise<Record<string, any>> {
		try {
			const client = this.getClient()
			const result = await client.registerEndpoint(endpoint)
			
			this.logger.log(`Registered endpoint ${endpoint.method} ${endpoint.path}`)
			return result
		} catch (error) {
			this.logger.error(`Failed to register endpoint: ${error.message}`, error.stack)
			throw error
		}
	}
}
