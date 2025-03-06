// Following TypeScript implementation standards from our guide
export interface ProcessRequest {
  id: string;
  data: unknown;
  timestamp?: string;
}

export interface ProcessResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  result: unknown;
  timestamp: string;
}

// Repository interface following clean architecture
export interface IEngineRepository {
  save(data: ProcessResponse): Promise<void>;
  getStatus(id: string): Promise<ProcessResponse>;
}
