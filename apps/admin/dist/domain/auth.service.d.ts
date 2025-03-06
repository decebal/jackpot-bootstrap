import { ConfigService } from '@nestjs/config';
import { User, AuthServiceInterface, UserRepositoryInterface } from './interfaces/admin.interface';
export declare class AuthService implements AuthServiceInterface {
    private readonly userRepository;
    private readonly configService;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly refreshTokenSecret;
    private readonly refreshTokenExpiresIn;
    constructor(userRepository: UserRepositoryInterface, configService: ConfigService);
    validateUser(username: string, password: string): Promise<User | null>;
    generateToken(user: User): Promise<{
        token: string;
        refreshToken: string;
        expiresAt: string;
    }>;
    verifyToken(token: string): Promise<User | null>;
    refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
        expiresAt: string;
    } | null>;
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    private parseExpiresIn;
}
