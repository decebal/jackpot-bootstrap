/**
 * Interface for the Speakeasy API request capture
 */
export interface SpeakeasyRequestCapture {
	request: Record<string, any>
	response: Record<string, any>
	metadata?: Record<string, any>
}

/**
 * Interface for endpoint registration
 */
export interface SpeakeasyEndpoint {
	path: string
	method: string
	description?: string
	tags?: string[]
}

/**
 * Interface for API metrics filters
 */
export interface ApiMetricsFilters {
	startDate?: string
	endDate?: string
	path?: string
	method?: string
	[key: string]: any
}

/**
 * Interface for API schema
 */
export interface ApiSchema {
	name: string
	version?: string
	description?: string
	paths?: Record<string, any>
	[key: string]: any
}

/**
 * Interface for API metrics
 */
export interface ApiMetrics {
	totalRequests?: number
	successRate?: number
	averageLatency?: number
	errorRate?: number
	requestsByEndpoint?: Record<string, number>
	[key: string]: any
}
