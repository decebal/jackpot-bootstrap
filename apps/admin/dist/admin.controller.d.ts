import { AdminService } from './admin.service';
import { CreateUserRequest, UserResponse, GetUserRequest, GetUsersRequest, GetUsersResponse, UpdateUserRequest, DeleteUserRequest, DeleteUserResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, ChangePasswordRequest, ChangePasswordResponse, ResetPasswordRequest, ResetPasswordResponse, SystemStatusRequest, SystemStatusResponse, GetAuditLogsRequest, GetAuditLogsResponse } from './domain/interfaces/admin.interface';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createUser(request: CreateUserRequest): Promise<UserResponse>;
    getUser(request: GetUserRequest): Promise<UserResponse>;
    getUsers(request: GetUsersRequest): Promise<GetUsersResponse>;
    updateUser(request: UpdateUserRequest): Promise<UserResponse>;
    deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
    changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse>;
    resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
    getSystemStatus(request: SystemStatusRequest): Promise<SystemStatusResponse>;
    getAuditLogs(request: GetAuditLogsRequest): Promise<GetAuditLogsResponse>;
}
