import * as grpc from '@grpc/grpc-js';
export declare function createGrpcTestClient<T = any>(protoPath: string, packageName: string, serviceName: string, host?: string): T;
export declare function createMockGrpcServer(protoPath: string, packageName: string, serviceName: string, implementations: grpc.UntypedServiceImplementation, host?: string): {
    server: grpc.Server;
    start: () => Promise<void>;
    stop: () => Promise<void>;
};
