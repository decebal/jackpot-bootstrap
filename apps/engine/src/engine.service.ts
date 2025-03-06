import { Injectable } from '@nestjs/common';
import { EngineRepository } from './infrastructure/repositories/engine.repository';
import { EngineProcessor } from './domain/engine.processor';

@Injectable()
export class EngineService {
  constructor(
    private readonly engineRepository: EngineRepository,
    private readonly engineProcessor: EngineProcessor,
  ) {}

  async processRequest(data: any) {
    try {
      // Following functional programming principles from our standards
      const processedData = await this.engineProcessor.process(data);
      await this.engineRepository.save(processedData);
      
      return {
        success: true,
        data: processedData,
      };
    } catch (err) {
      // Following error handling standards
      return {
        success: false,
        error: err.message,
      };
    }
  }

  async getStatus(data: any) {
    try {
      const status = await this.engineRepository.getStatus(data.id);
      return {
        success: true,
        status,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
