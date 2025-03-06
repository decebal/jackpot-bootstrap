import { EngineRepository } from './infrastructure/repositories/engine.repository';
import { EngineProcessor } from './domain/engine.processor';
export declare class EngineService {
    private readonly engineRepository;
    private readonly engineProcessor;
    constructor(engineRepository: EngineRepository, engineProcessor: EngineProcessor);
    processRequest(data: any): Promise<{
        success: boolean;
        data: import("./domain/interfaces/engine.interface").ProcessResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    getStatus(data: any): Promise<{
        success: boolean;
        status: import("./domain/interfaces/engine.interface").ProcessResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        status?: undefined;
    }>;
}
