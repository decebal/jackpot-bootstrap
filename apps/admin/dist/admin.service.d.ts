import { ClientGrpc } from '@nestjs/microservices';
import { CreateUserRequest, UserResponse, UpdateUserRequest, GetUsersResponse, LoginResponse, RefreshTokenResponse, SystemStatusResponse, GetAuditLogsResponse, UserRepositoryInterface, AuditLogRepositoryInterface, AuthServiceInterface } from './domain/interfaces/admin.interface';
export declare class AdminService {
    private readonly userRepository;
    private readonly auditLogRepository;
    private readonly authService;
    private readonly metricsClient;
    private readonly schedulerClient;
    private metricsService;
    private schedulerService;
    constructor(userRepository: UserRepositoryInterface, auditLogRepository: AuditLogRepositoryInterface, authService: AuthServiceInterface, metricsClient: ClientGrpc, schedulerClient: ClientGrpc);
    onModuleInit(): void;
    createUser(createUserRequest: CreateUserRequest): Promise<UserResponse>;
    getUser(id: string): Promise<UserResponse | null>;
    getUsers(role?: string, status?: string, search?: string, limit?: number, offset?: number): Promise<GetUsersResponse>;
    updateUser(updateUserRequest: UpdateUserRequest): Promise<UserResponse>;
    deleteUser(id: string): Promise<boolean>;
    login(username: string, password: string): Promise<LoginResponse>;
    refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    getSystemStatus(): Promise<SystemStatusResponse>;
    getAuditLogs(userId?: string, action?: string, resource?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetAuditLogsResponse>;
    private getDefaultPermissions;
}
