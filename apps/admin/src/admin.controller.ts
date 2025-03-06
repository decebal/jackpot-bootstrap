import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { AdminService } from './admin.service'
import {
	CreateUserRequest,
	UserResponse,
	GetUserRequest,
	GetUsersRequest,
	GetUsersResponse,
	UpdateUserRequest,
	DeleteUserRequest,
	DeleteUserResponse,
	LoginRequest,
	LoginResponse,
	RefreshTokenRequest,
	RefreshTokenResponse,
	ChangePasswordRequest,
	ChangePasswordResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	SystemStatusRequest,
	SystemStatusResponse,
	GetAuditLogsRequest,
	GetAuditLogsResponse
} from './domain/interfaces/admin.interface'

@Controller()
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@GrpcMethod('AdminService', 'CreateUser')
	async createUser(request: CreateUserRequest): Promise<UserResponse> {
		try {
			return await this.adminService.createUser(request)
		} catch (error) {
			console.error('Error creating user:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'GetUser')
	async getUser(request: GetUserRequest): Promise<UserResponse> {
		try {
			const user = await this.adminService.getUser(request.id)
			if (!user) {
				throw new Error(`User with ID ${request.id} not found`)
			}
			return user
		} catch (error) {
			console.error('Error getting user:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'GetUsers')
	async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
		try {
			return await this.adminService.getUsers(
				request.role,
				request.status,
				request.search,
				request.limit,
				request.offset
			)
		} catch (error) {
			console.error('Error getting users:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'UpdateUser')
	async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
		try {
			return await this.adminService.updateUser(request)
		} catch (error) {
			console.error('Error updating user:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'DeleteUser')
	async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
		try {
			const success = await this.adminService.deleteUser(request.id)
			return { success }
		} catch (error) {
			console.error('Error deleting user:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'Login')
	async login(request: LoginRequest): Promise<LoginResponse> {
		try {
			return await this.adminService.login(request.username, request.password)
		} catch (error) {
			console.error('Error during login:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'RefreshToken')
	async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
		try {
			return await this.adminService.refreshToken(request.refreshToken)
		} catch (error) {
			console.error('Error refreshing token:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'ChangePassword')
	async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
		try {
			const success = await this.adminService.changePassword(
				request.id,
				request.currentPassword,
				request.newPassword
			)
			return { success }
		} catch (error) {
			console.error('Error changing password:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'ResetPassword')
	async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
		try {
			const success = await this.adminService.resetPassword(request.email)
			return { success }
		} catch (error) {
			console.error('Error resetting password:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'GetSystemStatus')
	async getSystemStatus(request: SystemStatusRequest): Promise<SystemStatusResponse> {
		try {
			return await this.adminService.getSystemStatus()
		} catch (error) {
			console.error('Error getting system status:', error)
			throw error
		}
	}

	@GrpcMethod('AdminService', 'GetAuditLogs')
	async getAuditLogs(request: GetAuditLogsRequest): Promise<GetAuditLogsResponse> {
		try {
			return await this.adminService.getAuditLogs(
				request.userId,
				request.action,
				request.resource,
				request.startDate,
				request.endDate,
				request.limit,
				request.offset
			)
		} catch (error) {
			console.error('Error getting audit logs:', error)
			throw error
		}
	}
}
