"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
let UserService = class UserService {
    constructor(userRepository, auditLogRepository, authService) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.authService = authService;
    }
    async createUser(createUserRequest, createdBy) {
        const existingUserByUsername = await this.userRepository.getUserByUsername(createUserRequest.username);
        if (existingUserByUsername) {
            throw new common_1.BadRequestException('Username already exists');
        }
        const existingUserByEmail = await this.userRepository.getUserByEmail(createUserRequest.email);
        if (existingUserByEmail) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await this.authService.hashPassword(createUserRequest.password);
        const now = new Date().toISOString();
        const newUser = {
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
        };
        const createdUser = await this.userRepository.createUser({
            ...newUser,
            password: hashedPassword
        });
        await this.auditLogRepository.createLogEntry({
            userId: createdBy,
            username: 'admin',
            action: 'create',
            resource: 'user',
            resourceId: createdUser.id,
            details: { username: createdUser.username, role: createdUser.role },
            timestamp: now
        });
        return createdUser;
    }
    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getUserByUsername(username) {
        const user = await this.userRepository.getUserByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    async getUsers(role, status, search, limit, offset) {
        return this.userRepository.getUsers(role, status, search, limit, offset);
    }
    async updateUser(updateUserRequest, updatedBy) {
        const existingUser = await this.userRepository.getUserById(updateUserRequest.id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${updateUserRequest.id} not found`);
        }
        if (updateUserRequest.username && updateUserRequest.username !== existingUser.username) {
            const existingUserByUsername = await this.userRepository.getUserByUsername(updateUserRequest.username);
            if (existingUserByUsername) {
                throw new common_1.BadRequestException('Username already exists');
            }
        }
        if (updateUserRequest.email && updateUserRequest.email !== existingUser.email) {
            const existingUserByEmail = await this.userRepository.getUserByEmail(updateUserRequest.email);
            if (existingUserByEmail) {
                throw new common_1.BadRequestException('Email already exists');
            }
        }
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
        });
        await this.auditLogRepository.createLogEntry({
            userId: updatedBy,
            username: 'admin',
            action: 'update',
            resource: 'user',
            resourceId: updatedUser.id,
            details: {
                username: updatedUser.username,
                role: updatedUser.role,
                status: updatedUser.status
            },
            timestamp: new Date().toISOString()
        });
        return updatedUser;
    }
    async deleteUser(id, deletedBy) {
        const existingUser = await this.userRepository.getUserById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const result = await this.userRepository.deleteUser(id);
        await this.auditLogRepository.createLogEntry({
            userId: deletedBy,
            username: 'admin',
            action: 'delete',
            resource: 'user',
            resourceId: id,
            details: { username: existingUser.username },
            timestamp: new Date().toISOString()
        });
        return result;
    }
    getDefaultPermissions(role) {
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
                ];
            case 'operator':
                return [
                    'users:read',
                    'system:read',
                    'logs:read',
                    'metrics:read',
                    'jobs:read',
                    'jobs:create',
                    'jobs:update'
                ];
            case 'viewer':
                return [
                    'users:read',
                    'system:read',
                    'logs:read',
                    'metrics:read',
                    'jobs:read'
                ];
            default:
                return [];
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __param(1, (0, common_1.Inject)('AUDIT_LOG_REPOSITORY')),
    __param(2, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserService);
//# sourceMappingURL=user.service.js.map