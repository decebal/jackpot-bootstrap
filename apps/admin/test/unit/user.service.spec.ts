import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/domain/user.service';
import { UserRepositoryInterface, AuditLogRepositoryInterface, AuthServiceInterface } from '../../src/domain/interfaces/admin.interface';

describe('UserService', () => {
	let userService: UserService;
	let mockUserRepository: {
		getUserById: jest.Mock;
		getUserByUsername: jest.Mock;
		getUserByEmail: jest.Mock;
		createUser: jest.Mock;
		updateUser: jest.Mock;
		deleteUser: jest.Mock;
	};
	let mockAuditLogRepository: {
		createLogEntry: jest.Mock;
	};
	let mockAuthService: {
		hashPassword: jest.Mock;
	};

	beforeEach(async () => {
		// Create mock for UserRepository
		mockUserRepository = {
			getUserById: jest.fn().mockImplementation((id) => {
				if (id === 'existing-user-id') {
					return Promise.resolve({
						id: 'existing-user-id',
						username: 'testuser',
						email: 'test@example.com',
						role: 'admin',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					});
				}
				return Promise.resolve(null);
			}),
			getUserByUsername: jest.fn().mockImplementation((username) => {
				if (username === 'testuser') {
					return Promise.resolve({
						id: 'existing-user-id',
						username: 'testuser',
						email: 'test@example.com',
						role: 'admin',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					});
				}
				return Promise.resolve(null);
			}),
			getUserByEmail: jest.fn().mockImplementation((email) => {
				if (email === 'test@example.com') {
					return Promise.resolve({
						id: 'existing-user-id',
						username: 'testuser',
						email: 'test@example.com',
						role: 'admin',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					});
				}
				return Promise.resolve(null);
			}),
			createUser: jest.fn().mockImplementation((userData) => {
				return Promise.resolve({
					id: 'new-user-id',
					...userData,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				});
			}),
			updateUser: jest.fn().mockImplementation((id, userData) => {
				if (id === 'existing-user-id') {
					return Promise.resolve({
						id,
						...userData,
						updatedAt: new Date().toISOString()
					});
				}
				return Promise.resolve(null);
			}),
			deleteUser: jest.fn().mockImplementation((id) => {
				if (id === 'existing-user-id') {
					return Promise.resolve(true);
				}
				return Promise.resolve(false);
			})
		};

		// Create mock for AuditLogRepository
		mockAuditLogRepository = {
			createLogEntry: jest.fn().mockResolvedValue({
				id: 'audit-log-id',
				userId: 'admin-user-id',
				username: 'admin',
				action: 'create_user',
				resource: 'user',
				timestamp: new Date().toISOString()
			})
		};

		// Create mock for AuthService
		mockAuthService = {
			hashPassword: jest.fn().mockImplementation((password) => Promise.resolve('hashed_' + password))
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: 'USER_REPOSITORY',
					useValue: mockUserRepository
				},
				{
					provide: 'AUDIT_LOG_REPOSITORY',
					useValue: mockAuditLogRepository
				},
				{
					provide: 'AUTH_SERVICE',
					useValue: mockAuthService
				}
			],
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	it('should get a user by id', async () => {
		// Act
		const result = await userService.getUserById('existing-user-id');

		// Assert
		expect(result).toBeDefined();
		expect(result.id).toBe('existing-user-id');
		expect(result.username).toBe('testuser');
		expect(mockUserRepository.getUserById).toHaveBeenCalledWith('existing-user-id');
	});

	it('should throw NotFoundException for non-existent user id', async () => {
		// Act & Assert
		await expect(userService.getUserById('non-existent-id'))
			.rejects
			.toThrow('User with ID non-existent-id not found');
		
		expect(mockUserRepository.getUserById).toHaveBeenCalledWith('non-existent-id');
	});

	it('should create a new user', async () => {
		// Arrange
		const userData = {
			username: 'newuser',
			email: 'newuser@example.com',
			password: 'password123',
			role: 'operator' as 'admin' | 'operator' | 'viewer'
		};

		// Reset the mock implementation for createUser to return a predictable ID
		mockUserRepository.createUser = jest.fn().mockImplementation((user) => {
			return Promise.resolve({
				...user,
				id: 'new-user-id',
				status: 'active',
				permissions: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			});
		});

		// Act
		const result = await userService.createUser(userData, 'admin-user-id');

		// Assert
		expect(result).toBeDefined();
		expect(result.id).toBe('new-user-id');
		expect(result.username).toBe(userData.username);
		expect(result.email).toBe(userData.email);
		expect(mockUserRepository.createUser).toHaveBeenCalled();
		expect(mockAuditLogRepository.createLogEntry).toHaveBeenCalled();
	});
});
