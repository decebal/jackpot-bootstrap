import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EngineService } from './engine.service';

// Following our development standards with clean architecture
@Controller()
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @GrpcMethod('EngineService', 'ProcessRequest')
  async processRequest(data: any) {
    return this.engineService.processRequest(data);
  }

  @GrpcMethod('EngineService', 'GetStatus')
  async getStatus(data: any) {
    return this.engineService.getStatus(data);
  }
}
