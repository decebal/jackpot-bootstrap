import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { SchedulerService } from './scheduler.service'
import { 
	CreateJobRequest, 
	JobResponse, 
	GetJobRequest, 
	GetJobsRequest, 
	GetJobsResponse,
	UpdateJobRequest,
	DeleteJobRequest,
	DeleteJobResponse,
	ExecuteJobRequest,
	ExecuteJobResponse
} from './domain/interfaces/scheduler.interface'

@Controller()
export class SchedulerController {
	constructor(private readonly schedulerService: SchedulerService) {}

	@GrpcMethod('SchedulerService', 'CreateJob')
	async createJob(request: CreateJobRequest): Promise<JobResponse> {
		try {
			return await this.schedulerService.createJob(request)
		} catch (error) {
			console.error('Error creating job:', error)
			throw error
		}
	}

	@GrpcMethod('SchedulerService', 'GetJob')
	async getJob(request: GetJobRequest): Promise<JobResponse> {
		try {
			const job = await this.schedulerService.getJob(request.id)
			return job || {}
		} catch (error) {
			console.error('Error getting job:', error)
			throw error
		}
	}

	@GrpcMethod('SchedulerService', 'GetJobs')
	async getJobs(request: GetJobsRequest): Promise<GetJobsResponse> {
		try {
			return await this.schedulerService.getJobs(
				request.status,
				request.type,
				request.start_date,
				request.end_date,
				request.limit,
				request.offset
			)
		} catch (error) {
			console.error('Error getting jobs:', error)
			throw error
		}
	}

	@GrpcMethod('SchedulerService', 'UpdateJob')
	async updateJob(request: UpdateJobRequest): Promise<JobResponse> {
		try {
			return await this.schedulerService.updateJob(request)
		} catch (error) {
			console.error('Error updating job:', error)
			throw error
		}
	}

	@GrpcMethod('SchedulerService', 'DeleteJob')
	async deleteJob(request: DeleteJobRequest): Promise<DeleteJobResponse> {
		try {
			const success = await this.schedulerService.deleteJob(request.id)
			return { success }
		} catch (error) {
			console.error('Error deleting job:', error)
			throw error
		}
	}

	@GrpcMethod('SchedulerService', 'ExecuteJob')
	async executeJob(request: ExecuteJobRequest): Promise<ExecuteJobResponse> {
		try {
			return await this.schedulerService.executeJob(request.id)
		} catch (error) {
			console.error('Error executing job:', error)
			throw error
		}
	}
}
