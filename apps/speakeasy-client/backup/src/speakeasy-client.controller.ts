import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SpeakeasyClientService } from './speakeasy-client.service';
import { CaptureRequestDto } from './dto/capture-request.dto';
import { RegisterEndpointDto } from './dto/register-endpoint.dto';

@ApiTags('speakeasy')
@Controller('speakeasy')
export class SpeakeasyClientController {
  constructor(private readonly speakeasyClientService: SpeakeasyClientService) {}

  @ApiOperation({ summary: 'Capture API request and response', description: 'Captures an API request and response for Speakeasy analysis' })
  @ApiResponse({ status: 200, description: 'Request captured successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('capture')
  async captureRequest(@Body() captureDto: CaptureRequestDto) {
    return this.speakeasyClientService.captureApiRequest(captureDto);
  }

  @ApiOperation({ summary: 'Register API endpoint', description: 'Registers a new API endpoint with Speakeasy' })
  @ApiResponse({ status: 200, description: 'Endpoint registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid endpoint data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('register-endpoint')
  async registerEndpoint(@Body() endpointDto: RegisterEndpointDto) {
    return this.speakeasyClientService.registerEndpoint(endpointDto);
  }

  @ApiOperation({ summary: 'Get API schemas', description: 'Retrieves API schemas from Speakeasy' })
  @ApiResponse({ status: 200, description: 'Schemas retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('schemas')
  async getApiSchemas() {
    return this.speakeasyClientService.getApiSchemas();
  }

  @ApiOperation({ summary: 'Get API metrics', description: 'Retrieves API metrics from Speakeasy' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for metrics (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for metrics (ISO format)' })
  @ApiQuery({ name: 'path', required: false, description: 'Filter by API path' })
  @ApiQuery({ name: 'method', required: false, description: 'Filter by HTTP method' })
  @Get('metrics')
  async getApiMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('path') path?: string,
    @Query('method') method?: string,
  ) {
    const filters: Record<string, any> = {};
    
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (path) filters.path = path;
    if (method) filters.method = method;
    
    return this.speakeasyClientService.getApiMetrics(
      Object.keys(filters).length > 0 ? filters : undefined
    );
  }

  @ApiOperation({ summary: 'Forward request to gateway', description: 'Forwards a request to the gateway service and captures it with Speakeasy' })
  @ApiResponse({ status: 200, description: 'Request forwarded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'path', description: 'The path to forward to the gateway', example: '/engine/process' })
  @Post('forward/:path(*)')
  async forwardRequest(
    @Param('path') path: string,
    @Body() body: any,
    @Headers() headers: Record<string, string>,
    @Query('method') method: string = 'POST',
  ) {
    // Remove host header to avoid conflicts
    delete headers.host;
    
    return this.speakeasyClientService.forwardAndCaptureRequest(
      `/${path}`,
      method,
      body,
      headers,
    );
  }

  @ApiOperation({ summary: 'Health check', description: 'Check if the Speakeasy client service is running properly' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @Get('health')
  async healthCheck() {
    return { 
      status: 'ok', 
      service: 'speakeasy-client',
      timestamp: new Date().toISOString() 
    };
  }
}
