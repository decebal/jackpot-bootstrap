import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
export interface TestModuleOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
    mockModules?: Type<any>[];
    mockDynamicModules?: {
        module: Type<any>;
        factory: () => DynamicModule;
    }[];
    mockProviders?: Type<any>[];
    overrideProviders?: Array<{
        provide: any;
        useValue: any;
    }>;
}
export declare class TestModuleBuilder {
    static create(metadata: ModuleMetadata, options?: TestModuleOptions): TestingModuleBuilder;
    static createAndCompile(metadata: ModuleMetadata, options?: TestModuleOptions): Promise<TestingModule>;
}
