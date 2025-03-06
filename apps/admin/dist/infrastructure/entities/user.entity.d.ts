export declare class UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'operator' | 'viewer';
    firstName: string;
    lastName: string;
    status: 'active' | 'inactive';
    lastLogin: Date;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
