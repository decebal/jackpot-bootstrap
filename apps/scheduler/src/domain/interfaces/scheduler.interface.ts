export interface Job {
	id: string
	name: string
	type: string
	schedule: string // Cron expression
	target: {
		service: string
		method: string
		payload: any
	}
	status: 'active' | 'inactive' | 'completed' | 'failed'
	created_at: string
	updated_at: string
	last_executed_at?: string
	next_execution?: string
	result?: any
	error?: string
	metadata?: Record<string, any>
	retries?: number
	max_retries?: number
	timeout?: number
}

export interface CreateJobRequest {
	name: string
	type: string
	schedule: string
	target: {
		service: string
		method: string
		payload: any
	}
	status?: 'active' | 'inactive'
	metadata?: Record<string, any>
	retries?: number
	max_retries?: number
	timeout?: number
}

export interface JobResponse extends Partial<Job> {}

export interface GetJobRequest {
	id: string
}

export interface GetJobsRequest {
	status?: string
	type?: string
	start_date?: string
	end_date?: string
	limit?: number
	offset?: number
}

export interface GetJobsResponse {
	jobs: Job[]
	total: number
}

export interface UpdateJobRequest {
	id: string
	name?: string
	type?: string
	schedule?: string
	target?: {
		service: string
		method: string
		payload: any
	}
	status?: 'active' | 'inactive' | 'completed' | 'failed'
	last_executed_at?: string
	next_execution?: string
	result?: any
	error?: string
	metadata?: Record<string, any>
	retries?: number
	max_retries?: number
	timeout?: number
}

export interface DeleteJobRequest {
	id: string
}

export interface DeleteJobResponse {
	success: boolean
}

export interface ExecuteJobRequest {
	id: string
}

export interface ExecuteJobResponse {
	success: boolean
	data?: any
	error?: string
	executionTime: number
}

export interface JobRepositoryInterface {
	saveJob(job: Job): Promise<Job>
	getJobById(id: string): Promise<Job | null>
	getJobs(
		status?: string,
		type?: string,
		startDate?: string,
		endDate?: string,
		limit?: number,
		offset?: number
	): Promise<GetJobsResponse>
	updateJob(job: Job): Promise<Job>
	deleteJob(id: string): Promise<boolean>
	getJobsDueForExecution(): Promise<Job[]>
}

export interface JobProcessorInterface {
	processJob(request: CreateJobRequest): Promise<Job>
	validateJob(job: Job): boolean
}

export interface JobSchedulerInterface {
	scheduleJob(job: Job): Promise<void>
	unscheduleJob(jobId: string): Promise<void>
	executeJob(job: Job): Promise<ExecuteJobResponse>
}
