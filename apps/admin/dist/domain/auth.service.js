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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.jwtSecret = this.configService.get('JWT_SECRET', 'super-secret-jwt-key');
        this.jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN', '1h');
        this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET', 'super-secret-refresh-key');
        this.refreshTokenExpiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d');
    }
    async validateUser(username, password) {
        const user = await this.userRepository.getUserByUsername(username);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async generateToken(user) {
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions
        };
        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });
        const refreshToken = jwt.sign({ sub: user.id }, this.refreshTokenSecret, { expiresIn: this.refreshTokenExpiresIn });
        const expiresAt = new Date();
        const expiresInSeconds = this.parseExpiresIn(this.jwtExpiresIn);
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);
        return {
            token,
            refreshToken,
            expiresAt: expiresAt.toISOString()
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            const user = await this.userRepository.getUserById(decoded.sub);
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, this.refreshTokenSecret);
            const user = await this.userRepository.getUserById(decoded.sub);
            if (!user) {
                return null;
            }
            return this.generateToken(user);
        }
        catch (error) {
            return null;
        }
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    parseExpiresIn(expiresIn) {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 3600;
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 24 * 60 * 60;
            default: return 3600;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map