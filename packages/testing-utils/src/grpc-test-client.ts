import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { promisify } from 'util';

/**
 * Creates a gRPC client for testing purposes
 * @param protoPath - Path to the proto file relative to the monorepo root
 * @param packageName - The package name defined in the proto file
 * @param serviceName - The service name defined in the proto file
 * @param host - The host address of the gRPC server
 */
export function createGrpcTestClient<T = any>(
  protoPath: string,
  packageName: string,
  serviceName: string,
  host: string = 'localhost:50051'
): T {
  // Determine the absolute path to the proto file
  // Note: We need to go up to the monorepo root from the packages directory
  const absoluteProtoPath = join(process.cwd(), '..', '..', protoPath);
  
  // Load the proto file
  const packageDefinition = protoLoader.loadSync(absoluteProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  // Load the package definition
  const proto = grpc.loadPackageDefinition(packageDefinition)[packageName] as grpc.GrpcObject;
  
  // Create the client
  // Use type assertion to handle the indexing
  const ServiceClient = proto[serviceName] as grpc.ServiceClientConstructor;
  const client = new ServiceClient(host, grpc.credentials.createInsecure());
  
  // Promisify all client methods
  const promisifiedClient = {} as T;
  
  Object.entries(Object.getPrototypeOf(client)).forEach(([key, value]) => {
    if (typeof value === 'function' && key !== 'constructor') {
      (promisifiedClient as Record<string, any>)[key] = promisify((client as Record<string, any>)[key].bind(client));
    }
  });
  
  return promisifiedClient;
}

/**
 * Creates a mock gRPC server for testing
 * @param protoPath - Path to the proto file relative to the monorepo root
 * @param packageName - The package name defined in the proto file
 * @param serviceName - The service name defined in the proto file
 * @param implementations - The implementations of the service methods
 * @param host - The host address for the mock server
 */
export function createMockGrpcServer(
  protoPath: string,
  packageName: string,
  serviceName: string,
  implementations: grpc.UntypedServiceImplementation,
  host: string = 'localhost:50052'
): { server: grpc.Server; start: () => Promise<void>; stop: () => Promise<void> } {
  // Determine the absolute path to the proto file
  const absoluteProtoPath = join(process.cwd(), '..', '..', protoPath);
  
  // Load the proto file
  const packageDefinition = protoLoader.loadSync(absoluteProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  // Load the package definition
  const proto = grpc.loadPackageDefinition(packageDefinition)[packageName] as grpc.GrpcObject;
  
  // Create the server
  const server = new grpc.Server();
  
  // Add the service implementation
  const ServiceDefinition = proto[serviceName] as grpc.ServiceClientConstructor;
  server.addService(ServiceDefinition.service, implementations as grpc.UntypedServiceImplementation);
  
  // Return the server with start and stop methods
  return {
    server,
    start: () => {
      return new Promise<void>((resolve, reject) => {
        server.bindAsync(
          host,
          grpc.ServerCredentials.createInsecure(),
          (err, port) => {
            if (err) {
              reject(err);
              return;
            }
            server.start();
            resolve();
          }
        );
      });
    },
    stop: () => {
      return new Promise<void>((resolve) => {
        server.tryShutdown(() => {
          resolve();
        });
      });
    },
  };
}
