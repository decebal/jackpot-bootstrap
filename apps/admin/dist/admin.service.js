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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AdminService = class AdminService {
    constructor(userRepository, auditLogRepository, authService, metricsClient, schedulerClient) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.authService = authService;
        this.metricsClient = metricsClient;
        this.schedulerClient = schedulerClient;
    }
    onModuleInit() {
        this.metricsService = this.metricsClient.getService('MetricsService');
        this.schedulerService = this.schedulerClient.getService('SchedulerService');
    }
    async createUser(createUserRequest) {
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
            userId: 'system',
            username: 'system',
            action: 'create',
            resource: 'user',
            resourceId: createdUser.id,
            details: { username: createdUser.username, role: createdUser.role },
            timestamp: now
        });
        const { password, ...userResponse } = createdUser;
        return userResponse;
    }
    async getUser(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...userResponse } = user;
        return userResponse;
    }
    async getUsers(role, status, search, limit, offset) {
        const response = await this.userRepository.getUsers(role, status, search, limit, offset);
        const users = response.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        return {
            users,
            total: response.total
        };
    }
    async updateUser(updateUserRequest) {
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
            userId: 'system',
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
        });
        const { password, ...userResponse } = updatedUser;
        return userResponse;
    }
    async deleteUser(id) {
        const existingUser = await this.userRepository.getUserById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const result = await this.userRepository.deleteUser(id);
        await this.auditLogRepository.createLogEntry({
            userId: 'system',
            username: 'system',
            action: 'delete',
            resource: 'user',
            resourceId: id,
            details: { username: existingUser.username },
            timestamp: new Date().toISOString()
        });
        return result;
    }
    async login(username, password) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const { token, refreshToken, expiresAt } = await this.authService.generateToken(user);
        await this.userRepository.updateUser({
            id: user.id,
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        await this.auditLogRepository.createLogEntry({
            userId: user.id,
            username: user.username,
            action: 'login',
            resource: 'auth',
            timestamp: new Date().toISOString()
        });
        const { password: _, ...userResponse } = user;
        return {
            user: userResponse,
            token,
            expiresAt
        };
    }
    async refreshToken(refreshToken) {
        const result = await this.authService.refreshToken(refreshToken);
        if (!result) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return result;
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const isPasswordValid = await this.authService.comparePasswords(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await this.authService.hashPassword(newPassword);
        await this.userRepository.updateUser({
            id,
            password: hashedPassword,
            updatedAt: new Date().toISOString()
        });
        await this.auditLogRepository.createLogEntry({
            userId: id,
            username: user.username,
            action: 'change_password',
            resource: 'auth',
            timestamp: new Date().toISOString()
        });
        return true;
    }
    async resetPassword(email) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            return true;
        }
        console.log(`Password reset requested for user: ${user.username} (${email})`);
        await this.auditLogRepository.createLogEntry({
            userId: user.id,
            username: user.username,
            action: 'reset_password_request',
            resource: 'auth',
            timestamp: new Date().toISOString()
        });
        return true;
    }
    async getSystemStatus() {
        const timestamp = new Date().toISOString();
        const services = [];
        services.push({
            name: 'admin',
            status: 'up',
            version: '1.0.0',
            uptime: process.uptime(),
            lastChecked: timestamp
        });
        try {
            const metricsStatusObs = this.metricsService.getStatus({});
            const metricsStatus = await (0, rxjs_1.firstValueFrom)(metricsStatusObs);
            services.push({
                name: 'metrics',
                status: metricsStatus.status === 'ok' ? 'up' : 'degraded',
                lastChecked: timestamp,
                details: metricsStatus.services
            });
        }
        catch (error) {
            console.error('Error checking metrics service:', error);
            services.push({
                name: 'metrics',
                status: 'down',
                lastChecked: timestamp,
                details: { error: error.message }
            });
        }
        try {
            const schedulerStatusObs = this.schedulerService.getStatus({});
            const schedulerStatus = await (0, rxjs_1.firstValueFrom)(schedulerStatusObs);
            services.push({
                name: 'scheduler',
                status: schedulerStatus.status === 'ok' ? 'up' : 'degraded',
                lastChecked: timestamp,
                details: schedulerStatus.services
            });
        }
        catch (error) {
            console.error('Error checking scheduler service:', error);
            services.push({
                name: 'scheduler',
                status: 'down',
                lastChecked: timestamp,
                details: { error: error.message }
            });
        }
        const downServices = services.filter(service => service.status === 'down');
        const degradedServices = services.filter(service => service.status === 'degraded');
        let overallStatus = 'healthy';
        if (downServices.length > 0) {
            overallStatus = 'unhealthy';
        }
        else if (degradedServices.length > 0) {
            overallStatus = 'degraded';
        }
        return {
            overallStatus,
            services,
            timestamp
        };
    }
    async getAuditLogs(userId, action, resource, startDate, endDate, limit, offset) {
        return this.auditLogRepository.getLogEntries(userId, action, resource, startDate, endDate, limit, offset);
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
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __param(1, (0, common_1.Inject)('AUDIT_LOG_REPOSITORY')),
    __param(2, (0, common_1.Inject)('AUTH_SERVICE')),
    __param(3, (0, common_1.Inject)('METRICS_PACKAGE')),
    __param(4, (0, common_1.Inject)('SCHEDULER_PACKAGE')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminService);
//# sourceMappingURL=admin.service.js.map