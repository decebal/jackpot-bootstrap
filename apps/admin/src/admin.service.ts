import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import {
	User,
	CreateUserRequest,
	UserResponse,
	UpdateUserRequest,
	GetUsersResponse,
	LoginResponse,
	RefreshTokenResponse,
	SystemStatusResponse,
	GetAuditLogsResponse,
	UserRepositoryInterface,
	AuditLogRepositoryInterface,
	AuthServiceInterface,
	ServiceStatus
} from './domain/interfaces/admin.interface'

import { Observable } from 'rxjs'

interface MetricsServiceClient {
	getStatus(data: {}): Observable<{ status: string; services: Record<string, any> }>
}

interface SchedulerServiceClient {
	getStatus(data: {}): Observable<{ status: string; services: Record<string, any> }>
}

@Injectable()
export class AdminService {
	private metricsService: MetricsServiceClient
	private schedulerService: SchedulerServiceClient

	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: UserRepositoryInterface,
		@Inject('AUDIT_LOG_REPOSITORY') private readonly auditLogRepository: AuditLogRepositoryInterface,
		@Inject('AUTH_SERVICE') private readonly authService: AuthServiceInterface,
		@Inject('METRICS_PACKAGE') private readonly metricsClient: ClientGrpc,
		@Inject('SCHEDULER_PACKAGE') private readonly schedulerClient: ClientGrpc
	) {}

	onModuleInit() {
		this.metricsService = this.metricsClient.getService<MetricsServiceClient>('MetricsService')
		this.schedulerService = this.schedulerClient.getService<SchedulerServiceClient>('SchedulerService')
	}

	async createUser(createUserRequest: CreateUserRequest): Promise<UserResponse> {
		// Check if user already exists
		const existingUserByUsername = await this.userRepository.getUserByUsername(createUserRequest.username)
		if (existingUserByUsername) {
			throw new BadRequestException('Username already exists')
		}

		const existingUserByEmail = await this.userRepository.getUserByEmail(createUserRequest.email)
		if (existingUserByEmail) {
			throw new BadRequestException('Email already exists')
		}

		// Hash password
		const hashedPassword = await this.authService.hashPassword(createUserRequest.password)

		// Create user
		const now = new Date().toISOString()
		const newUser: User = {
			id: `user_${Date.now()}`,
			username: createUserRequest.username,
			email: createUserRequest.email,
			role: createUserRequest.role,
			firstName: createUserRequest.firstName || '',
			lastName: createUserRequest.lastName || '',
			status: 'active',
			createdAt: now,
			updatedAt: now,
			permissions: createUserRequest.permissions || this.getDefaultPermissions(createUserRequest.role)
		}

		const createdUser = await this.userRepository.createUser({
			...newUser,
			password: hashedPassword
		} as any)

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: 'system',
			username: 'system',
			action: 'create',
			resource: 'user',
			resourceId: createdUser.id,
			details: { username: createdUser.username, role: createdUser.role },
			timestamp: now
		})

		// Return user without password
		const { password, ...userResponse } = createdUser as any
		return userResponse
	}

	async getUser(id: string): Promise<UserResponse | null> {
		const user = await this.userRepository.getUserById(id)
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		// Return user without password
		const { password, ...userResponse } = user as any
		return userResponse
	}

	async getUsers(
		role?: string,
		status?: string,
		search?: string,
		limit?: number,
		offset?: number
	): Promise<GetUsersResponse> {
		const response = await this.userRepository.getUsers(role, status, search, limit, offset)
		
		// Ensure we don't return passwords
		const users = response.users.map(user => {
			const { password, ...userWithoutPassword } = user as any
			return userWithoutPassword
		})

		return {
			users,
			total: response.total
		}
	}

	async updateUser(updateUserRequest: UpdateUserRequest): Promise<UserResponse> {
		// Check if user exists
		const existingUser = await this.userRepository.getUserById(updateUserRequest.id)
		if (!existingUser) {
			throw new NotFoundException(`User with ID ${updateUserRequest.id} not found`)
		}

		// Check if username is being updated and if it's already taken
		if (updateUserRequest.username && updateUserRequest.username !== existingUser.username) {
			const existingUserByUsername = await this.userRepository.getUserByUsername(updateUserRequest.username)
			if (existingUserByUsername) {
				throw new BadRequestException('Username already exists')
			}
		}

		// Check if email is being updated and if it's already taken
		if (updateUserRequest.email && updateUserRequest.email !== existingUser.email) {
			const existingUserByEmail = await this.userRepository.getUserByEmail(updateUserRequest.email)
			if (existingUserByEmail) {
				throw new BadRequestException('Email already exists')
			}
		}

		// Update user
		const updatedUser = await this.userRepository.updateUser({
			id: updateUserRequest.id,
			...(updateUserRequest.username && { username: updateUserRequest.username }),
			...(updateUserRequest.email && { email: updateUserRequest.email }),
			...(updateUserRequest.role && { role: updateUserRequest.role }),
			...(updateUserRequest.firstName && { firstName: updateUserRequest.firstName }),
			...(updateUserRequest.lastName && { lastName: updateUserRequest.lastName }),
			...(updateUserRequest.status && { status: updateUserRequest.status }),
			...(updateUserRequest.permissions && { permissions: updateUserRequest.permissions }),
			updatedAt: new Date().toISOString()
		})

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: 'system', // In a real app, this would be the ID of the admin making the change
			username: 'system',
			action: 'update',
			resource: 'user',
			resourceId: updatedUser.id,
			details: { 
				username: updatedUser.username, 
				role: updatedUser.role,
				status: updatedUser.status
			},
			timestamp: new Date().toISOString()
		})

		// Return user without password
		const { password, ...userResponse } = updatedUser as any
		return userResponse
	}

	async deleteUser(id: string): Promise<boolean> {
		// Check if user exists
		const existingUser = await this.userRepository.getUserById(id)
		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		// Delete user
		const result = await this.userRepository.deleteUser(id)

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: 'system', // In a real app, this would be the ID of the admin making the change
			username: 'system',
			action: 'delete',
			resource: 'user',
			resourceId: id,
			details: { username: existingUser.username },
			timestamp: new Date().toISOString()
		})

		return result
	}

	async login(username: string, password: string): Promise<LoginResponse> {
		// Validate credentials
		const user = await this.authService.validateUser(username, password)
		if (!user) {
			throw new UnauthorizedException('Invalid credentials')
		}

		// Check if user is active
		if (user.status !== 'active') {
			throw new UnauthorizedException('User account is inactive')
		}

		// Generate token
		const { token, refreshToken, expiresAt } = await this.authService.generateToken(user)

		// Update last login
		await this.userRepository.updateUser({
			id: user.id,
			lastLogin: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		})

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: user.id,
			username: user.username,
			action: 'login',
			resource: 'auth',
			timestamp: new Date().toISOString()
		})

		// Return user without password
		const { password: _, ...userResponse } = user as any
		return {
			user: userResponse,
			token,
			expiresAt
		}
	}

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const result = await this.authService.refreshToken(refreshToken)
		if (!result) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		return result
	}

	async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
		// Get user
		const user = await this.userRepository.getUserById(id)
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		// Verify current password
		const isPasswordValid = await this.authService.comparePasswords(currentPassword, (user as any).password)
		if (!isPasswordValid) {
			throw new UnauthorizedException('Current password is incorrect')
		}

		// Hash new password
		const hashedPassword = await this.authService.hashPassword(newPassword)

		// Update password
		await this.userRepository.updateUser({
			id,
			password: hashedPassword,
			updatedAt: new Date().toISOString()
		} as any)

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: id,
			username: user.username,
			action: 'change_password',
			resource: 'auth',
			timestamp: new Date().toISOString()
		})

		return true
	}

	async resetPassword(email: string): Promise<boolean> {
		// Check if user exists
		const user = await this.userRepository.getUserByEmail(email)
		if (!user) {
			// For security reasons, don't reveal that the email doesn't exist
			return true
		}

		// In a real app, we would generate a reset token and send an email
		// For this example, we'll just log it
		console.log(`Password reset requested for user: ${user.username} (${email})`)

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: user.id,
			username: user.username,
			action: 'reset_password_request',
			resource: 'auth',
			timestamp: new Date().toISOString()
		})

		return true
	}

	async getSystemStatus(): Promise<SystemStatusResponse> {
		const timestamp = new Date().toISOString()
		const services: ServiceStatus[] = []

		// Check admin service status (this service)
		services.push({
			name: 'admin',
			status: 'up',
			version: '1.0.0',
			uptime: process.uptime(),
			lastChecked: timestamp
		})

		// Check metrics service status
		try {
			const metricsStatusObs = this.metricsService.getStatus({})
			const metricsStatus = await firstValueFrom(metricsStatusObs) as { status: string; services: Record<string, any> }
			services.push({
				name: 'metrics',
				status: metricsStatus.status === 'ok' ? 'up' : 'degraded',
				lastChecked: timestamp,
				details: metricsStatus.services
			})
		} catch (error) {
			console.error('Error checking metrics service:', error)
			services.push({
				name: 'metrics',
				status: 'down',
				lastChecked: timestamp,
				details: { error: (error as Error).message }
			})
		}

		// Check scheduler service status
		try {
			const schedulerStatusObs = this.schedulerService.getStatus({})
			const schedulerStatus = await firstValueFrom(schedulerStatusObs) as { status: string; services: Record<string, any> }
			services.push({
				name: 'scheduler',
				status: schedulerStatus.status === 'ok' ? 'up' : 'degraded',
				lastChecked: timestamp,
				details: schedulerStatus.services
			})
		} catch (error) {
			console.error('Error checking scheduler service:', error)
			services.push({
				name: 'scheduler',
				status: 'down',
				lastChecked: timestamp,
				details: { error: (error as Error).message }
			})
		}

		// Determine overall status
		const downServices = services.filter(service => service.status === 'down')
		const degradedServices = services.filter(service => service.status === 'degraded')
		
		let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
		if (downServices.length > 0) {
			overallStatus = 'unhealthy'
		} else if (degradedServices.length > 0) {
			overallStatus = 'degraded'
		}

		return {
			overallStatus,
			services,
			timestamp
		}
	}

	async getAuditLogs(
		userId?: string,
		action?: string,
		resource?: string,
		startDate?: string,
		endDate?: string,
		limit?: number,
		offset?: number
	): Promise<GetAuditLogsResponse> {
		return this.auditLogRepository.getLogEntries(
			userId,
			action,
			resource,
			startDate,
			endDate,
			limit,
			offset
		)
	}

	private getDefaultPermissions(role: 'admin' | 'operator' | 'viewer'): string[] {
		switch (role) {
			case 'admin':
				return [
					'users:read',
					'users:create',
					'users:update',
					'users:delete',
					'system:read',
					'logs:read',
					'metrics:read',
					'jobs:read',
					'jobs:create',
					'jobs:update',
					'jobs:delete'
				]
			case 'operator':
				return [
					'users:read',
					'system:read',
					'logs:read',
					'metrics:read',
					'jobs:read',
					'jobs:create',
					'jobs:update'
				]
			case 'viewer':
				return [
					'users:read',
					'system:read',
					'logs:read',
					'metrics:read',
					'jobs:read'
				]
			default:
				return []
		}
	}
}
