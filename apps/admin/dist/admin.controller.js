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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createUser(request) {
        try {
            return await this.adminService.createUser(request);
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    async getUser(request) {
        try {
            const user = await this.adminService.getUser(request.id);
            if (!user) {
                throw new Error(`User with ID ${request.id} not found`);
            }
            return user;
        }
        catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }
    async getUsers(request) {
        try {
            return await this.adminService.getUsers(request.role, request.status, request.search, request.limit, request.offset);
        }
        catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }
    async updateUser(request) {
        try {
            return await this.adminService.updateUser(request);
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    async deleteUser(request) {
        try {
            const success = await this.adminService.deleteUser(request.id);
            return { success };
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
    async login(request) {
        try {
            return await this.adminService.login(request.username, request.password);
        }
        catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    async refreshToken(request) {
        try {
            return await this.adminService.refreshToken(request.refreshToken);
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }
    async changePassword(request) {
        try {
            const success = await this.adminService.changePassword(request.id, request.currentPassword, request.newPassword);
            return { success };
        }
        catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
    async resetPassword(request) {
        try {
            const success = await this.adminService.resetPassword(request.email);
            return { success };
        }
        catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
    async getSystemStatus(request) {
        try {
            return await this.adminService.getSystemStatus();
        }
        catch (error) {
            console.error('Error getting system status:', error);
            throw error;
        }
    }
    async getAuditLogs(request) {
        try {
            return await this.adminService.getAuditLogs(request.userId, request.action, request.resource, request.startDate, request.endDate, request.limit, request.offset);
        }
        catch (error) {
            console.error('Error getting audit logs:', error);
            throw error;
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'CreateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'GetUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'GetUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'UpdateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'DeleteUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'Login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'RefreshToken'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refreshToken", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'ChangePassword'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'ResetPassword'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'GetSystemStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemStatus", null);
__decorate([
    (0, microservices_1.GrpcMethod)('AdminService', 'GetAuditLogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map