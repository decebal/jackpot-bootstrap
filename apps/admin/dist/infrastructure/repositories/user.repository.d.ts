import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User, UserRepositoryInterface, GetUsersResponse } from '../../domain/interfaces/admin.interface';
export declare class UserRepository implements UserRepositoryInterface {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
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
    private mapEntityToDomain;
}
