"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcTestClient = createGrpcTestClient;
exports.createMockGrpcServer = createMockGrpcServer;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = require("path");
const util_1 = require("util");
function createGrpcTestClient(protoPath, packageName, serviceName, host = 'localhost:50051') {
    const absoluteProtoPath = (0, path_1.join)(process.cwd(), '..', '..', protoPath);
    const packageDefinition = protoLoader.loadSync(absoluteProtoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDefinition)[packageName];
    const ServiceClient = proto[serviceName];
    const client = new ServiceClient(host, grpc.credentials.createInsecure());
    const promisifiedClient = {};
    Object.entries(Object.getPrototypeOf(client)).forEach(([key, value]) => {
        if (typeof value === 'function' && key !== 'constructor') {
            promisifiedClient[key] = (0, util_1.promisify)(client[key].bind(client));
        }
    });
    return promisifiedClient;
}
function createMockGrpcServer(protoPath, packageName, serviceName, implementations, host = 'localhost:50052') {
    const absoluteProtoPath = (0, path_1.join)(process.cwd(), '..', '..', protoPath);
    const packageDefinition = protoLoader.loadSync(absoluteProtoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDefinition)[packageName];
    const server = new grpc.Server();
    const ServiceDefinition = proto[serviceName];
    server.addService(ServiceDefinition.service, implementations);
    return {
        server,
        start: () => {
            return new Promise((resolve, reject) => {
                server.bindAsync(host, grpc.ServerCredentials.createInsecure(), (err, port) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    server.start();
                    resolve();
                });
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                server.tryShutdown(() => {
                    resolve();
                });
            });
        },
    };
}
//# sourceMappingURL=grpc-test-client.js.map