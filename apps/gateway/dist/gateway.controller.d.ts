import { GatewayService } from './gateway.service';
import { ProcessRequestDto } from './dto/process-request.dto';
export declare class GatewayController {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    processEngineRequest(request: ProcessRequestDto): Promise<import("./interfaces/engine.interface").ProcessResponseMessage | {
        success: boolean;
        error: any;
    }>;
    getEngineStatus(id: string): Promise<import("./interfaces/engine.interface").ProcessResponseMessage | {
        success: boolean;
        error: any;
    }>;
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
