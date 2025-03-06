import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProcessRequestDto } from './dto/process-request.dto';
export declare class GatewayService implements OnModuleInit {
    private readonly engineClient;
    private engineService;
    constructor(engineClient: ClientGrpc);
    onModuleInit(): void;
    processEngineRequest(request: ProcessRequestDto): Promise<import("./interfaces/engine.interface").ProcessResponseMessage | {
        success: boolean;
        error: any;
    }>;
    getEngineStatus(id: string): Promise<import("./interfaces/engine.interface").ProcessResponseMessage | {
        success: boolean;
        error: any;
    }>;
}
