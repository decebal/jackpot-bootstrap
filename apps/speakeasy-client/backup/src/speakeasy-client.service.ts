import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SpeakeasyApiService } from './services/speakeasy-api.service';
import { CaptureRequestDto } from './dto/capture-request.dto';
import { RegisterEndpointDto } from './dto/register-endpoint.dto';

@Injectable()
export class SpeakeasyClientService {
  private readonly logger = new Logger(SpeakeasyClientService.name);
  private readonly gatewayUrl: string;

  constructor(
    private readonly speakeasyApiService: SpeakeasyApiService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gatewayUrl = this.configService.get<string>('GATEWAY_SERVICE_URL') || 'http://localhost:3000';
  }

  /**
   * Capture an API request and response for Speakeasy analysis
   */
  async captureApiRequest(captureDto: CaptureRequestDto) {
    try {
      const result = await this.speakeasyApiService.captureRequest(
        captureDto.request,
        captureDto.response,
        captureDto.metadata,
      );

      return {
        success: result,
        message: result ? 'Request captured successfully' : 'Failed to capture request',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error capturing API request: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Failed to capture request: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Register a new API endpoint with Speakeasy
   */
  async registerEndpoint(endpointDto: RegisterEndpointDto) {
    try {
      const result = await this.speakeasyApiService.registerEndpoint({
        path: endpointDto.path,
        method: endpointDto.method,
        description: endpointDto.description,
        tags: endpointDto.tags,
      });

      return {
        success: true,
        data: result,
        message: 'Endpoint registered successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error registering endpoint: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Failed to register endpoint: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get API schemas from Speakeasy
   */
  async getApiSchemas() {
    try {
      const schemas = await this.speakeasyApiService.getApiSchemas();
      
      return {
        success: true,
        data: schemas,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting API schemas: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Failed to get API schemas: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get API metrics from Speakeasy
   */
  async getApiMetrics(filters?: Record<string, any>) {
    try {
      const metrics = await this.speakeasyApiService.getApiMetrics(filters);
      
      return {
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting API metrics: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Failed to get API metrics: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Forward a request to the gateway service and capture it with Speakeasy
   */
  async forwardAndCaptureRequest(path: string, method: string, body: any, headers: Record<string, string>) {
    try {
      // Prepare the request to the gateway
      const requestUrl = `${this.gatewayUrl}${path}`;
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      // Make the request to the gateway
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await firstValueFrom(this.httpService.get(requestUrl, requestOptions));
          break;
        case 'POST':
          response = await firstValueFrom(this.httpService.post(requestUrl, body, requestOptions));
          break;
        case 'PUT':
          response = await firstValueFrom(this.httpService.put(requestUrl, body, requestOptions));
          break;
        case 'DELETE':
          response = await firstValueFrom(this.httpService.delete(requestUrl, requestOptions));
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Capture the request and response with Speakeasy
      const requestData = {
        url: requestUrl,
        method: method.toUpperCase(),
        headers: requestOptions.headers,
        body,
      };

      const responseData = {
        status: response.status,
        headers: response.headers,
        data: response.data,
      };

      await this.speakeasyApiService.captureRequest(requestData, responseData);

      // Return the gateway response
      return response.data;
    } catch (error) {
      this.logger.error(`Error forwarding request: ${error.message}`, error.stack);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
          success: false,
          status: error.response.status,
          message: `Gateway error: ${error.message}`,
          data: error.response.data,
        };
      } else if (error.request) {
        // The request was made but no response was received
        return {
          success: false,
          message: 'No response received from gateway',
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        return {
          success: false,
          message: `Request setup error: ${error.message}`,
        };
      }
    }
  }
}
