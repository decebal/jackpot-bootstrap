import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { UserEntity } from '../entities/user.entity'
import { 
	User, 
	UserRepositoryInterface, 
	GetUsersResponse 
} from '../../domain/interfaces/admin.interface'

@Injectable()
export class UserRepository implements UserRepositoryInterface {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async createUser(user: User): Promise<User> {
		const userEntity = this.userRepository.create({
			...user,
			createdAt: new Date(user.createdAt),
			updatedAt: new Date(user.updatedAt)
		})
		
		const savedUser = await this.userRepository.save(userEntity)
		return this.mapEntityToDomain(savedUser)
	}

	async getUserById(id: string): Promise<User | null> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		return userEntity ? this.mapEntityToDomain(userEntity) : null
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const userEntity = await this.userRepository.findOne({ where: { username } })
		return userEntity ? this.mapEntityToDomain(userEntity) : null
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const userEntity = await this.userRepository.findOne({ where: { email } })
		return userEntity ? this.mapEntityToDomain(userEntity) : null
	}

	async getUsers(
		role?: string,
		status?: string,
		search?: string,
		limit?: number,
		offset?: number
	): Promise<GetUsersResponse> {
		const whereClause: any = {}
		
		if (role) {
			whereClause.role = role
		}
		
		if (status) {
			whereClause.status = status
		}
		
		if (search) {
			whereClause.username = Like(`%${search}%`)
		}
		
		const [users, total] = await this.userRepository.findAndCount({
			where: whereClause,
			take: limit || 10,
			skip: offset || 0,
			order: {
				createdAt: 'DESC'
			}
		})
		
		return {
			users: users.map(user => this.mapEntityToDomain(user)),
			total
		}
	}

	async updateUser(user: Partial<User> & { id: string }): Promise<User> {
		await this.userRepository.update(user.id, {
			...user,
			updatedAt: new Date()
		})
		
		const updatedUser = await this.userRepository.findOne({ where: { id: user.id } })
		if (!updatedUser) {
			throw new Error(`User with ID ${user.id} not found after update`)
		}
		return this.mapEntityToDomain(updatedUser)
	}

	async deleteUser(id: string): Promise<boolean> {
		const result = await this.userRepository.delete(id)
		return result.affected !== null && result.affected !== undefined && result.affected > 0
	}

	async validateCredentials(username: string, password: string): Promise<User | null> {
		// Note: This method should not be used directly.
		// Authentication should be handled by the AuthService.
		// This is just a placeholder to satisfy the interface.
		return null
	}

	private mapEntityToDomain(entity: UserEntity): User {
		return {
			id: entity.id,
			username: entity.username,
			email: entity.email,
			password: entity.password,
			role: entity.role,
			firstName: entity.firstName,
			lastName: entity.lastName,
			status: entity.status,
			lastLogin: entity.lastLogin?.toISOString(),
			permissions: entity.permissions,
			createdAt: entity.createdAt.toISOString(),
			updatedAt: entity.updatedAt.toISOString()
		} as User
	}
}
