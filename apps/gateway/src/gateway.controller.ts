import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ProcessRequestDto } from './dto/process-request.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EngineProcessResponse, EngineStatusResponse, HealthCheckResponse } from './dto/api-response.dto';

@ApiTags('gateway')
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @ApiOperation({ summary: 'Process an engine request', description: 'Sends a request to the engine service for processing' })
  @ApiResponse({ status: 200, description: 'Request processed successfully', type: EngineProcessResponse })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error or engine service unavailable' })
  @Post('engine/process')
  async processEngineRequest(@Body() request: ProcessRequestDto) {
    return this.gatewayService.processEngineRequest(request);
  }

  @ApiOperation({ summary: 'Get engine process status', description: 'Retrieves the status of a previously submitted engine process request' })
  @ApiParam({ name: 'id', description: 'The ID of the process request to check', example: 'req-123456' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully', type: EngineStatusResponse })
  @ApiResponse({ status: 404, description: 'Process request not found' })
  @ApiResponse({ status: 500, description: 'Internal server error or engine service unavailable' })
  @Get('engine/status/:id')
  async getEngineStatus(@Param('id') id: string) {
    return this.gatewayService.getEngineStatus(id);
  }

  @ApiOperation({ summary: 'Health check', description: 'Check if the API gateway is running properly' })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthCheckResponse })
  @Get('health')
  async healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
