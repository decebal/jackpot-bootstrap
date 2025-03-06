export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'operator' | 'viewer';
    firstName?: string;
    lastName?: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
    permissions: string[];
}
export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'operator' | 'viewer';
    firstName?: string;
    lastName?: string;
    permissions?: string[];
}
export interface UpdateUserRequest {
    id: string;
    username?: string;
    email?: string;
    role?: 'admin' | 'operator' | 'viewer';
    firstName?: string;
    lastName?: string;
    status?: 'active' | 'inactive';
    permissions?: string[];
}
export interface UserResponse extends Omit<User, 'password'> {
}
export interface GetUserRequest {
    id: string;
}
export interface GetUsersRequest {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
}
export interface GetUsersResponse {
    users: UserResponse[];
    total: number;
}
export interface DeleteUserRequest {
    id: string;
}
export interface DeleteUserResponse {
    success: boolean;
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    user: UserResponse;
    token: string;
    expiresAt: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
}
export interface ChangePasswordRequest {
    id: string;
    currentPassword: string;
    newPassword: string;
}
export interface ChangePasswordResponse {
    success: boolean;
}
export interface ResetPasswordRequest {
    email: string;
}
export interface ResetPasswordResponse {
    success: boolean;
}
export interface ServiceStatus {
    name: string;
    status: 'up' | 'down' | 'degraded';
    version?: string;
    uptime?: number;
    lastChecked: string;
    details?: Record<string, any>;
}
export interface SystemStatusRequest {
}
export interface SystemStatusResponse {
    overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    services: ServiceStatus[];
    timestamp: string;
}
export interface AuditLogEntry {
    id: string;
    userId: string;
    username: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    timestamp: string;
    ip?: string;
    userAgent?: string;
}
export interface GetAuditLogsRequest {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}
export interface GetAuditLogsResponse {
    logs: AuditLogEntry[];
    total: number;
}
export interface UserRepositoryInterface {
    createUser(user: User): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUsers(role?: string, status?: string, search?: string, limit?: number, offset?: number): Promise<GetUsersResponse>;
    updateUser(user: Partial<User> & {
        id: string;
    }): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
    validateCredentials(username: string, password: string): Promise<User | null>;
}
export interface AuditLogRepositoryInterface {
    createLogEntry(entry: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry>;
    getLogEntries(userId?: string, action?: string, resource?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetAuditLogsResponse>;
}
export interface AuthServiceInterface {
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
}
