/**
 * Jackpot Engine gRPC SDK
 * @author Jackpot Team
 */

// Export the Engine Client and its configuration
export { EngineClient, EngineClientError } from './engine-client';
export type { EngineClientConfig, ProcessingOptions } from './engine-client';

// Export all types from the generated proto file
export * from './generated/engine';
