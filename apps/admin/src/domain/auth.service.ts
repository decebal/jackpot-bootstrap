import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { SignOptions } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { 
	User, 
	AuthServiceInterface, 
	UserRepositoryInterface 
} from './interfaces/admin.interface'

@Injectable()
export class AuthService implements AuthServiceInterface {
	private readonly jwtSecret: string
	private readonly jwtExpiresIn: string
	private readonly refreshTokenSecret: string
	private readonly refreshTokenExpiresIn: string

	constructor(
		@Inject('USER_REPOSITORY') private readonly userRepository: UserRepositoryInterface,
		private readonly configService: ConfigService
	) {
		this.jwtSecret = this.configService.get<string>('JWT_SECRET', 'super-secret-jwt-key')
		this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h')
		this.refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET', 'super-secret-refresh-key')
		this.refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN', '7d')
	}

	async validateUser(username: string, password: string): Promise<User | null> {
		const user = await this.userRepository.getUserByUsername(username)
		if (!user) {
			return null
		}

		const isPasswordValid = await this.comparePasswords(password, (user as any).password)
		if (!isPasswordValid) {
			return null
		}

		return user
	}

	async generateToken(user: User): Promise<{ token: string; refreshToken: string; expiresAt: string }> {
		const payload = {
			sub: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			permissions: user.permissions
		}

		// Use the expiresIn value directly in the options object
		const token = jwt.sign(payload, this.jwtSecret, { 
			expiresIn: this.jwtExpiresIn as any // Type assertion to handle string type
		})
		
		const refreshToken = jwt.sign(
			{ sub: user.id },
			this.refreshTokenSecret,
			{ expiresIn: this.refreshTokenExpiresIn as any } // Type assertion to handle string type
		)

		// Calculate expiration date
		const expiresAt = new Date()
		const expiresInSeconds = this.parseExpiresIn(this.jwtExpiresIn)
		expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds)

		return {
			token,
			refreshToken,
			expiresAt: expiresAt.toISOString()
		}
	}

	async verifyToken(token: string): Promise<User | null> {
		try {
			const decoded = jwt.verify(token, this.jwtSecret) as { sub: string }
			const user = await this.userRepository.getUserById(decoded.sub)
			return user
		} catch (error) {
			return null
		}
	}

	async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresAt: string } | null> {
		try {
			const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as { sub: string }
			const user = await this.userRepository.getUserById(decoded.sub)
			
			if (!user) {
				return null
			}

			return this.generateToken(user)
		} catch (error) {
			return null
		}
	}

	async hashPassword(password: string): Promise<string> {
		const saltRounds = 10
		return bcrypt.hash(password, saltRounds)
	}

	async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword)
	}

	private parseExpiresIn(expiresIn: string): number {
		// Parse expressions like '1h', '7d', '60m', etc.
		const match = expiresIn.match(/^(\d+)([smhd])$/)
		if (!match) {
			return 3600 // Default to 1 hour
		}

		const value = parseInt(match[1], 10)
		const unit = match[2]

		switch (unit) {
			case 's': return value
			case 'm': return value * 60
			case 'h': return value * 60 * 60
			case 'd': return value * 24 * 60 * 60
			default: return 3600
		}
	}
}
