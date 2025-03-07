import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

/**
 * Options for building a test module
 */
export interface TestModuleOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  /**
   * Modules to override with mocks
   */
  mockModules?: Type<any>[];
  
  /**
   * Dynamic modules to override with mocks
   */
  mockDynamicModules?: {
    module: Type<any>;
    factory: () => DynamicModule;
  }[];
  
  /**
   * Providers to override with mocks
   */
  mockProviders?: Type<any>[];
  
  /**
   * Custom provider overrides
   */
  overrideProviders?: Array<{
    provide: any;
    useValue: any;
  }>;
}

/**
 * Helper class to build test modules with common configuration
 */
export class TestModuleBuilder {
  /**
   * Creates a testing module builder with the given options
   * @param metadata - Module metadata
   * @param options - Test module options
   * @returns A testing module builder
   */
  static create(
    metadata: ModuleMetadata,
    options: TestModuleOptions = {}
  ): TestingModuleBuilder {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [...(metadata.imports || []), ...(options.imports || [])],
      controllers: metadata.controllers || [],
      providers: [
        ...(metadata.providers || []),
        ...(options.providers || []),
      ],
      exports: metadata.exports || [],
    });

    // Override modules with mocks
    if (options.mockModules && options.mockModules.length > 0) {
      options.mockModules.forEach((module) => {
        // Use overrideProvider for modules since overrideModule doesn't have useValue
        // This is a workaround for the TypeScript error
        testingModuleBuilder.overrideProvider(module).useValue({});
      });
    }

    // Override dynamic modules with mocks
    if (options.mockDynamicModules && options.mockDynamicModules.length > 0) {
      options.mockDynamicModules.forEach(({ module, factory }) => {
        // Use overrideProvider for modules since overrideModule doesn't have useFactory
        // This is a workaround for the TypeScript error
        testingModuleBuilder.overrideProvider(module).useFactory({
          factory: factory,
          inject: [],
        });
      });
    }

    // Override providers with mocks
    if (options.mockProviders && options.mockProviders.length > 0) {
      options.mockProviders.forEach((provider) => {
        testingModuleBuilder.overrideProvider(provider).useValue({});
      });
    }

    // Override providers with custom values
    if (options.overrideProviders && options.overrideProviders.length > 0) {
      options.overrideProviders.forEach(({ provide, useValue }) => {
        testingModuleBuilder.overrideProvider(provide).useValue(useValue);
      });
    }

    return testingModuleBuilder;
  }

  /**
   * Creates and compiles a testing module with the given options
   * @param metadata - Module metadata
   * @param options - Test module options
   * @returns A compiled testing module
   */
  static async createAndCompile(
    metadata: ModuleMetadata,
    options: TestModuleOptions = {}
  ): Promise<TestingModule> {
    const testingModuleBuilder = this.create(metadata, options);
    return testingModuleBuilder.compile();
  }
}
