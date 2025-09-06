// lib/api-response.ts

import { ErrorCode, ErrorMessages } from '@/types/error-codes';
import { NextResponse } from 'next/server';

// Fallback if nanoid is not available
function generateTraceId(): string {
    // return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return crypto.randomUUID();
}

// Types
export interface ApiErrorDetail {
    code: string | ErrorCode;
    message: string;
    field?: string;
}

export interface ApiError {
    code: string | ErrorCode;
    message: string;
    details?: ApiErrorDetail[];
}

export interface ApiMeta {
    timestamp: string;
    traceId: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    error: ApiError | null;
    meta: ApiMeta;
}

// Error codes constants
// export const ERROR_CODES = {
//     // Validation
//     VALIDATION_ERROR: 'VALIDATION_ERROR',
//     INVALID_INPUT: 'INVALID_INPUT',
//     MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
//     TOO_SHORT: 'TOO_SHORT',
//     TOO_LONG: 'TOO_LONG',
//     INVALID_FORMAT: 'INVALID_FORMAT',

//     // Authentication & Authorization
//     UNAUTHORIZED: 'UNAUTHORIZED',
//     FORBIDDEN: 'FORBIDDEN',
//     INVALID_TOKEN: 'INVALID_TOKEN',
//     TOKEN_EXPIRED: 'TOKEN_EXPIRED',

//     // Resource
//     NOT_FOUND: 'NOT_FOUND',
//     ALREADY_EXISTS: 'ALREADY_EXISTS',
//     RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

//     // Server
//     INTERNAL_ERROR: 'INTERNAL_ERROR',
//     DATABASE_ERROR: 'DATABASE_ERROR',
//     EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

//     // Rate limiting
//     RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
// } as const;

// Helper function to generate meta
function generateMeta(traceId?: string): ApiMeta {
    return {
        timestamp: new Date().toISOString(),
        traceId: traceId || generateTraceId(),
    };
}

// Base response builder
function buildResponse<T>(
    success: boolean,
    message: string,
    data: T | null = null,
    error: ApiError | null = null,
    statusCode: number = 200,
    traceId?: string
): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
        success,
        message,
        data,
        error,
        meta: generateMeta(traceId),
    };

    return NextResponse.json(response, { status: statusCode });
}

// Success responses
export class ApiSuccess {
    static ok<T>(data: T, message: string = 'Success', traceId?: string): NextResponse<ApiResponse<T>> {
        return buildResponse(true, message, data, null, 200, traceId);
    }

    static created<T>(data: T, message: string = 'Created successfully', traceId?: string): NextResponse<ApiResponse<T>> {
        return buildResponse(true, message, data, null, 201, traceId);
    }

    static noContent(message: string = 'No content', traceId?: string): NextResponse<ApiResponse<null>> {
        return buildResponse(true, message, null, null, 204, traceId);
    }
}

// Error responses
export class ApiError {
    static badRequest(
        message: string = ErrorMessages[ErrorCode.INVALID_PARAM],
        errorCode: ErrorCode | string = ErrorCode.INVALID_PARAM,
        details?: ApiErrorDetail[], traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
                details,
            },
            400,
            traceId
        );
    }

    static validation(
        message: string = ErrorMessages[ErrorCode.VALIDATION_ERROR],
        details: ApiErrorDetail[], traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: ErrorCode.VALIDATION_ERROR,
                message,
                details,
            },
            400,
            traceId
        );
    }

    static unauthorized(
        message: string = ErrorMessages[ErrorCode.UNAUTHORIZED],
        errorCode: ErrorCode | string = ErrorCode.UNAUTHORIZED, traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            401,
            traceId
        );
    }

    static forbidden(
        message: string = ErrorMessages[ErrorCode.FORBIDDEN],
        errorCode: ErrorCode | string = ErrorCode.FORBIDDEN, traceId?: string 
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            403,
            traceId
        );
    }

    static notFound(
        message: string = ErrorMessages[ErrorCode.RESOURCE_NOT_FOUND],
        errorCode: ErrorCode | string = ErrorCode.RESOURCE_NOT_FOUND, traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            404,
            traceId
        );
    }

    static conflict(
        message: string = ErrorMessages[ErrorCode.RESOURCE_ALREADY_EXISTS],
        errorCode: ErrorCode | string = ErrorCode.RESOURCE_ALREADY_EXISTS, traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            409,
            traceId
        );
    }

    static rateLimited(
        message: string = ErrorMessages[ErrorCode.RATE_LIMIT_EXCEEDED],
        errorCode: ErrorCode | string = ErrorCode.RATE_LIMIT_EXCEEDED, traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            429,
            traceId
        );
    }

    static internal(
        message: string = ErrorMessages[ErrorCode.INTERNAL_ERROR],
        errorCode: ErrorCode | string = ErrorCode.INTERNAL_ERROR, traceId?: string
    ): NextResponse<ApiResponse<null>> {
        return buildResponse(
            false,
            message,
            null,
            {
                code: errorCode,
                message,
            },
            500,
            traceId
        );
    }
}

// Validation helper
export class ValidationHelper {
    static createValidationError(field: string, message: string, code?: string | ErrorCode): ApiErrorDetail {
        return {
            code: code || ErrorCode.VALIDATION_ERROR,
            message,
            field,
        };
    }

    static required(field: string): ApiErrorDetail {
        return this.createValidationError(
            field,
            ErrorMessages[ErrorCode.MISSING_REQUIRED_FIELD],
            ErrorCode.MISSING_REQUIRED_FIELD
        );
    }

    static tooShort(field: string, minLength: number): ApiErrorDetail {
        return this.createValidationError(
            field,
            `${field} must be at least ${minLength} characters`,
            ErrorCode.TOO_SHORT
        );
    }

    static tooLong(field: string, maxLength: number): ApiErrorDetail {
        return this.createValidationError(
            field,
            `${field} must not exceed ${maxLength} characters`,
            ErrorCode.TOO_LONG
        );
    }

    static invalidFormat(field: string, format?: string): ApiErrorDetail {
        const message = format
            ? `${field} must be in ${format} format`
            : `${field} format is invalid`;

        return this.createValidationError(
            field,
            message,
            ErrorCode.INVALID_FORMAT
        );
    }
}

// Error handler for try-catch blocks
export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
    console.error('API Error:', error);

    if (error instanceof Error) {
        return ApiError.internal(error.message);
    }

    return ApiError.internal('An unexpected error occurred');
}

// Middleware helper for consistent error handling
export function withErrorHandling<T extends any[], R>(
    handler: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R | NextResponse<ApiResponse<null>>> => {
        try {
            return await handler(...args);
        } catch (error) {
            return handleApiError(error);
        }
    };
}