import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare function createTestDatabaseConfig(entities: any[]): TypeOrmModuleOptions;
export declare function createMySqlTestConfig(entities: any[], database?: string): TypeOrmModuleOptions;
export declare function clearDatabase(connection: any): Promise<void>;
