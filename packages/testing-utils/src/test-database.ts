import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Creates TypeORM configuration for in-memory SQLite database for testing
 * @param entities - Array of entity classes to be used in the database
 * @returns TypeORM configuration for testing
 */
export function createTestDatabaseConfig(entities: any[]): TypeOrmModuleOptions {
  return {
    type: 'better-sqlite3',
    database: ':memory:',
    entities,
    synchronize: true,
    dropSchema: true,
    logging: false,
  };
}

/**
 * Creates TypeORM configuration for testing with MySQL
 * This is useful for integration tests that need to test MySQL-specific features
 * @param entities - Array of entity classes to be used in the database
 * @param database - Database name (default: 'test')
 * @returns TypeORM configuration for testing with MySQL
 */
export function createMySqlTestConfig(
  entities: any[],
  database: string = 'test'
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '3306', 10),
    username: process.env.TEST_DB_USERNAME || 'root',
    password: process.env.TEST_DB_PASSWORD || 'password',
    database,
    entities,
    synchronize: true,
    dropSchema: true,
    logging: false,
  };
}

/**
 * Helper function to clear all tables in the database
 * @param connection - TypeORM connection
 */
export async function clearDatabase(connection: any): Promise<void> {
  const entities = connection.entityMetadatas;
  
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.clear();
  }
}
