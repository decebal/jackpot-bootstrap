"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModuleBuilder = void 0;
const testing_1 = require("@nestjs/testing");
class TestModuleBuilder {
    static create(metadata, options = {}) {
        const testingModuleBuilder = testing_1.Test.createTestingModule({
            imports: [...(metadata.imports || []), ...(options.imports || [])],
            controllers: metadata.controllers || [],
            providers: [
                ...(metadata.providers || []),
                ...(options.providers || []),
            ],
            exports: metadata.exports || [],
        });
        if (options.mockModules && options.mockModules.length > 0) {
            options.mockModules.forEach((module) => {
                testingModuleBuilder.overrideProvider(module).useValue({});
            });
        }
        if (options.mockDynamicModules && options.mockDynamicModules.length > 0) {
            options.mockDynamicModules.forEach(({ module, factory }) => {
                testingModuleBuilder.overrideProvider(module).useFactory({
                    factory: factory,
                    inject: [],
                });
            });
        }
        if (options.mockProviders && options.mockProviders.length > 0) {
            options.mockProviders.forEach((provider) => {
                testingModuleBuilder.overrideProvider(provider).useValue({});
            });
        }
        if (options.overrideProviders && options.overrideProviders.length > 0) {
            options.overrideProviders.forEach(({ provide, useValue }) => {
                testingModuleBuilder.overrideProvider(provide).useValue(useValue);
            });
        }
        return testingModuleBuilder;
    }
    static async createAndCompile(metadata, options = {}) {
        const testingModuleBuilder = this.create(metadata, options);
        return testingModuleBuilder.compile();
    }
}
exports.TestModuleBuilder = TestModuleBuilder;
//# sourceMappingURL=test-module-builder.js.map