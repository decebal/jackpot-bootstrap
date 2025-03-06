import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ProcessRequestDto } from './dto/process-request.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('engine/process')
  async processEngineRequest(@Body() request: ProcessRequestDto) {
    return this.gatewayService.processEngineRequest(request);
  }

  @Get('engine/status/:id')
  async getEngineStatus(@Param('id') id: string) {
    return this.gatewayService.getEngineStatus(id);
  }

  // Health check endpoint
  @Get('health')
  async healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
