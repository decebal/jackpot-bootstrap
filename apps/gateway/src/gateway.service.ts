import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProcessRequestDto } from './dto/process-request.dto';
import { EngineService } from './interfaces/engine.interface';

@Injectable()
export class GatewayService implements OnModuleInit {
  private engineService: EngineService;

  constructor(
    @Inject('ENGINE_SERVICE') private readonly engineClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // Get the gRPC service proxy
    this.engineService = this.engineClient.getService<EngineService>('EngineService');
  }

  async processEngineRequest(request: ProcessRequestDto) {
    try {
      // Convert request data to Buffer for gRPC transmission
      const grpcRequest = {
        id: request.id,
        data: Buffer.from(JSON.stringify(request.data)),
        timestamp: request.timestamp || new Date().toISOString(),
      };

      // Make gRPC call and await response
      const response = await firstValueFrom(
        this.engineService.processRequest(grpcRequest)
      );

      // If response contains result as Buffer, convert back to object
      if (response.result instanceof Buffer) {
        response.result = JSON.parse(response.result.toString());
      }

      return response;
    } catch (error) {
      // Following error handling standards
      console.error('Engine Process Request Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process request',
      };
    }
  }

  async getEngineStatus(id: string) {
    try {
      const response = await firstValueFrom(
        this.engineService.getStatus({ id })
      );

      // If response contains result as Buffer, convert back to object
      if (response.result instanceof Buffer) {
        response.result = JSON.parse(response.result.toString());
      }

      return response;
    } catch (error) {
      console.error('Engine Status Request Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get status',
      };
    }
  }
}
