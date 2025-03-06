import { User, CreateUserRequest, UpdateUserRequest, GetUsersResponse, UserRepositoryInterface, AuditLogRepositoryInterface, AuthServiceInterface } from './interfaces/admin.interface';
export declare class UserService {
    private readonly userRepository;
    private readonly auditLogRepository;
    private readonly authService;
    constructor(userRepository: UserRepositoryInterface, auditLogRepository: AuditLogRepositoryInterface, authService: AuthServiceInterface);
    createUser(createUserRequest: CreateUserRequest, createdBy: string): Promise<User>;
    getUserById(id: string): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    getUsers(role?: string, status?: string, search?: string, limit?: number, offset?: number): Promise<GetUsersResponse>;
    updateUser(updateUserRequest: UpdateUserRequest, updatedBy: string): Promise<User>;
    deleteUser(id: string, deletedBy: string): Promise<boolean>;
    private getDefaultPermissions;
}
