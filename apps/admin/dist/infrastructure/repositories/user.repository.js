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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        const userEntity = this.userRepository.create({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
        });
        const savedUser = await this.userRepository.save(userEntity);
        return this.mapEntityToDomain(savedUser);
    }
    async getUserById(id) {
        const userEntity = await this.userRepository.findOne({ where: { id } });
        return userEntity ? this.mapEntityToDomain(userEntity) : null;
    }
    async getUserByUsername(username) {
        const userEntity = await this.userRepository.findOne({ where: { username } });
        return userEntity ? this.mapEntityToDomain(userEntity) : null;
    }
    async getUserByEmail(email) {
        const userEntity = await this.userRepository.findOne({ where: { email } });
        return userEntity ? this.mapEntityToDomain(userEntity) : null;
    }
    async getUsers(role, status, search, limit, offset) {
        const whereClause = {};
        if (role) {
            whereClause.role = role;
        }
        if (status) {
            whereClause.status = status;
        }
        if (search) {
            whereClause.username = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [users, total] = await this.userRepository.findAndCount({
            where: whereClause,
            take: limit || 10,
            skip: offset || 0,
            order: {
                createdAt: 'DESC'
            }
        });
        return {
            users: users.map(user => this.mapEntityToDomain(user)),
            total
        };
    }
    async updateUser(user) {
        await this.userRepository.update(user.id, {
            ...user,
            updatedAt: new Date()
        });
        const updatedUser = await this.userRepository.findOne({ where: { id: user.id } });
        if (!updatedUser) {
            throw new Error(`User with ID ${user.id} not found after update`);
        }
        return this.mapEntityToDomain(updatedUser);
    }
    async deleteUser(id) {
        const result = await this.userRepository.delete(id);
        return result.affected !== null && result.affected !== undefined && result.affected > 0;
    }
    async validateCredentials(username, password) {
        return null;
    }
    mapEntityToDomain(entity) {
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
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map