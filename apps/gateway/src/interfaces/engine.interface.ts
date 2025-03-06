import { Observable } from 'rxjs';

export interface ProcessRequestMessage {
  id: string;
  data: Buffer;
  timestamp: string;
}

export interface GetStatusRequest {
  id: string;
}

export interface ProcessResponseMessage {
  id: string;
  status: string;
  result: Buffer | Record<string, unknown>;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface EngineService {
  processRequest(request: ProcessRequestMessage): Observable<ProcessResponseMessage>;
  getStatus(request: GetStatusRequest): Observable<ProcessResponseMessage>;
}
