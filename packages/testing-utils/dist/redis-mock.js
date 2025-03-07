"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MockRedisModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRedisModule = exports.REDIS_CLIENT = void 0;
exports.createMockRedisProvider = createMockRedisProvider;
exports.createRedisClientSpy = createRedisClientSpy;
const common_1 = require("@nestjs/common");
const ioredis_mock_1 = require("ioredis-mock");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
function createMockRedisProvider() {
    return {
        provide: exports.REDIS_CLIENT,
        useFactory: () => {
            return new ioredis_mock_1.default();
        },
    };
}
let MockRedisModule = MockRedisModule_1 = class MockRedisModule {
    static forTest() {
        return {
            module: MockRedisModule_1,
            providers: [createMockRedisProvider()],
            exports: [exports.REDIS_CLIENT],
        };
    }
};
exports.MockRedisModule = MockRedisModule;
exports.MockRedisModule = MockRedisModule = MockRedisModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], MockRedisModule);
function createRedisClientSpy(methods = [
    'get',
    'set',
    'del',
    'hget',
    'hset',
    'hdel',
    'hgetall',
    'hmset',
    'expire',
    'publish',
    'subscribe',
]) {
    const redisMock = new ioredis_mock_1.default();
    methods.forEach((method) => {
        jest.spyOn(redisMock, method);
    });
    return redisMock;
}
//# sourceMappingURL=redis-mock.js.map