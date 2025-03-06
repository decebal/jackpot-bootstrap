import { DynamicModule } from '@nestjs/common';
export interface RedisConfig {
    host: string;
    port: number;
}
export declare class RedisModule {
    static forRootAsync(options: {
        imports: any[];
        useFactory: (...args: any[]) => Promise<RedisConfig> | RedisConfig;
        inject: any[];
    }): DynamicModule;
}
