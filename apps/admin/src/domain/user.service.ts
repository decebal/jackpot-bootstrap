import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common'
import { 
	User,
	CreateUserRequest,
	UpdateUserRequest,
	GetUsersResponse,
	UserRepositoryInterface,
	AuditLogRepositoryInterface,
	AuthServiceInterface
} from './interfaces/admin.interface'

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: UserRepositoryInterface,
		@Inject('AUDIT_LOG_REPOSITORY') private readonly auditLogRepository: AuditLogRepositoryInterface,
		@Inject('AUTH_SERVICE') private readonly authService: AuthServiceInterface
	) {}

	async createUser(createUserRequest: CreateUserRequest, createdBy: string): Promise<User> {
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
			userId: createdBy,
			username: 'admin', // This would be fetched in a real application
			action: 'create',
			resource: 'user',
			resourceId: createdUser.id,
			details: { username: createdUser.username, role: createdUser.role },
			timestamp: now
		})

		return createdUser
	}

	async getUserById(id: string): Promise<User> {
		const user = await this.userRepository.getUserById(id)
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}
		return user
	}

	async getUserByUsername(username: string): Promise<User> {
		const user = await this.userRepository.getUserByUsername(username)
		if (!user) {
			throw new NotFoundException(`User with username ${username} not found`)
		}
		return user
	}

	async getUsers(
		role?: string,
		status?: string,
		search?: string,
		limit?: number,
		offset?: number
	): Promise<GetUsersResponse> {
		return this.userRepository.getUsers(role, status, search, limit, offset)
	}

	async updateUser(updateUserRequest: UpdateUserRequest, updatedBy: string): Promise<User> {
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
			userId: updatedBy,
			username: 'admin', // This would be fetched in a real application
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

		return updatedUser
	}

	async deleteUser(id: string, deletedBy: string): Promise<boolean> {
		// Check if user exists
		const existingUser = await this.userRepository.getUserById(id)
		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		// Delete user
		const result = await this.userRepository.deleteUser(id)

		// Log the action
		await this.auditLogRepository.createLogEntry({
			userId: deletedBy,
			username: 'admin', // This would be fetched in a real application
			action: 'delete',
			resource: 'user',
			resourceId: id,
			details: { username: existingUser.username },
			timestamp: new Date().toISOString()
		})

		return result
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
