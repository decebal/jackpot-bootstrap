/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { ClosedEnum } from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

/**
 * The result of the processing if completed
 */
export type EngineStatusResponseResult = {};

/**
 * The current status of the request
 */
export const Status = {
  Pending: "pending",
  Processing: "processing",
  Completed: "completed",
  Failed: "failed",
} as const;
/**
 * The current status of the request
 */
export type Status = ClosedEnum<typeof Status>;

export type EngineStatusResponse = {
  /**
   * Error message if processing failed
   */
  error?: string | undefined;
  /**
   * The ID of the request
   */
  id: string;
  /**
   * The result of the processing if completed
   */
  result?: EngineStatusResponseResult | undefined;
  /**
   * The current status of the request
   */
  status: Status;
  /**
   * Indicates if the status check was successful
   */
  success: boolean;
};

/** @internal */
export const EngineStatusResponseResult$inboundSchema: z.ZodType<
  EngineStatusResponseResult,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type EngineStatusResponseResult$Outbound = {};

/** @internal */
export const EngineStatusResponseResult$outboundSchema: z.ZodType<
  EngineStatusResponseResult$Outbound,
  z.ZodTypeDef,
  EngineStatusResponseResult
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace EngineStatusResponseResult$ {
  /** @deprecated use `EngineStatusResponseResult$inboundSchema` instead. */
  export const inboundSchema = EngineStatusResponseResult$inboundSchema;
  /** @deprecated use `EngineStatusResponseResult$outboundSchema` instead. */
  export const outboundSchema = EngineStatusResponseResult$outboundSchema;
  /** @deprecated use `EngineStatusResponseResult$Outbound` instead. */
  export type Outbound = EngineStatusResponseResult$Outbound;
}

export function engineStatusResponseResultToJSON(
  engineStatusResponseResult: EngineStatusResponseResult,
): string {
  return JSON.stringify(
    EngineStatusResponseResult$outboundSchema.parse(engineStatusResponseResult),
  );
}

export function engineStatusResponseResultFromJSON(
  jsonString: string,
): SafeParseResult<EngineStatusResponseResult, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => EngineStatusResponseResult$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'EngineStatusResponseResult' from JSON`,
  );
}

/** @internal */
export const Status$inboundSchema: z.ZodNativeEnum<typeof Status> = z
  .nativeEnum(Status);

/** @internal */
export const Status$outboundSchema: z.ZodNativeEnum<typeof Status> =
  Status$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Status$ {
  /** @deprecated use `Status$inboundSchema` instead. */
  export const inboundSchema = Status$inboundSchema;
  /** @deprecated use `Status$outboundSchema` instead. */
  export const outboundSchema = Status$outboundSchema;
}

/** @internal */
export const EngineStatusResponse$inboundSchema: z.ZodType<
  EngineStatusResponse,
  z.ZodTypeDef,
  unknown
> = z.object({
  error: z.string().optional(),
  id: z.string(),
  result: z.lazy(() => EngineStatusResponseResult$inboundSchema).optional(),
  status: Status$inboundSchema,
  success: z.boolean(),
});

/** @internal */
export type EngineStatusResponse$Outbound = {
  error?: string | undefined;
  id: string;
  result?: EngineStatusResponseResult$Outbound | undefined;
  status: string;
  success: boolean;
};

/** @internal */
export const EngineStatusResponse$outboundSchema: z.ZodType<
  EngineStatusResponse$Outbound,
  z.ZodTypeDef,
  EngineStatusResponse
> = z.object({
  error: z.string().optional(),
  id: z.string(),
  result: z.lazy(() => EngineStatusResponseResult$outboundSchema).optional(),
  status: Status$outboundSchema,
  success: z.boolean(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace EngineStatusResponse$ {
  /** @deprecated use `EngineStatusResponse$inboundSchema` instead. */
  export const inboundSchema = EngineStatusResponse$inboundSchema;
  /** @deprecated use `EngineStatusResponse$outboundSchema` instead. */
  export const outboundSchema = EngineStatusResponse$outboundSchema;
  /** @deprecated use `EngineStatusResponse$Outbound` instead. */
  export type Outbound = EngineStatusResponse$Outbound;
}

export function engineStatusResponseToJSON(
  engineStatusResponse: EngineStatusResponse,
): string {
  return JSON.stringify(
    EngineStatusResponse$outboundSchema.parse(engineStatusResponse),
  );
}

export function engineStatusResponseFromJSON(
  jsonString: string,
): SafeParseResult<EngineStatusResponse, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => EngineStatusResponse$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'EngineStatusResponse' from JSON`,
  );
}
