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
exports.SchedulerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const scheduler_service_1 = require("./scheduler.service");
let SchedulerController = class SchedulerController {
    constructor(schedulerService) {
        this.schedulerService = schedulerService;
    }
    async createJob(request) {
        try {
            return await this.schedulerService.createJob(request);
        }
        catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }
    async getJob(request) {
        try {
            const job = await this.schedulerService.getJob(request.id);
            return job || {};
        }
        catch (error) {
            console.error('Error getting job:', error);
            throw error;
        }
    }
    async getJobs(request) {
        try {
            return await this.schedulerService.getJobs(request.status, request.type, request.start_date, request.end_date, request.limit, request.offset);
        }
        catch (error) {
            console.error('Error getting jobs:', error);
            throw error;
        }
    }
    async updateJob(request) {
        try {
            return await this.schedulerService.updateJob(request);
        }
        catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    }
    async deleteJob(request) {
        try {
            const success = await this.schedulerService.deleteJob(request.id);
            return { success };
        }
        catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }
    async executeJob(request) {
        try {
            return await this.schedulerService.executeJob(request.id);
        }
        catch (error) {
            console.error('Error executing job:', error);
            throw error;
        }
    }
};
exports.SchedulerController = SchedulerController;
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'CreateJob'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "createJob", null);
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'GetJob'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getJob", null);
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'GetJobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getJobs", null);
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'UpdateJob'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "updateJob", null);
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'DeleteJob'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "deleteJob", null);
__decorate([
    (0, microservices_1.GrpcMethod)('SchedulerService', 'ExecuteJob'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "executeJob", null);
exports.SchedulerController = SchedulerController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService])
], SchedulerController);
//# sourceMappingURL=scheduler.controller.js.map