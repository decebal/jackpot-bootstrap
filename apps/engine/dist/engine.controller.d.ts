import { EngineService } from './engine.service';
export declare class EngineController {
    private readonly engineService;
    constructor(engineService: EngineService);
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
