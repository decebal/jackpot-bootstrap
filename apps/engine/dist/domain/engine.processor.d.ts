import { EngineValidator } from './engine.validator';
import { ProcessRequest, ProcessResponse } from './interfaces/engine.interface';
export declare class EngineProcessor {
    private readonly validator;
    constructor(validator: EngineValidator);
    process(request: ProcessRequest): Promise<ProcessResponse>;
    private processRequest;
}
