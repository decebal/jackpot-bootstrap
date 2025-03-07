"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestDatabaseConfig = createTestDatabaseConfig;
exports.createMySqlTestConfig = createMySqlTestConfig;
exports.clearDatabase = clearDatabase;
function createTestDatabaseConfig(entities) {
    return {
        type: 'better-sqlite3',
        database: ':memory:',
        entities,
        synchronize: true,
        dropSchema: true,
        logging: false,
    };
}
function createMySqlTestConfig(entities, database = 'test') {
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
async function clearDatabase(connection) {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
}
//# sourceMappingURL=test-database.js.map