import { ErrorCode, ErrorMessages } from "@/types/error-codes";

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(
        code: ErrorCode,
        message?: string,
        statusCode: number = 400,
        details?: unknown
    ) {
        super(message || ErrorMessages[code]);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        // Ensure instanceof works correctly
        Object.setPrototypeOf(this, AppError.prototype);
    }

    public toJSON() {
        return {
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
        };
    }
}

// Helper functions to create specific types of errors
export const createValidationError = (details?: unknown) =>
    new AppError(ErrorCode.VALIDATION_ERROR, undefined, 400, details);

export const createUnauthorizedError = (message?: string) =>
    new AppError(ErrorCode.UNAUTHORIZED, message, 401);

export const createForbiddenError = (message?: string) =>
    new AppError(ErrorCode.FORBIDDEN, message, 403);

export const createNotFoundError = (message?: string) =>
    new AppError(ErrorCode.NOT_FOUND, message, 404);

export const createDatabaseError = (details?: unknown) =>
    new AppError(ErrorCode.DATABASE_ERROR, undefined, 500, details);

// INVALID PARAMS
export const createInvalidParamsError = (message?: string) =>
    new AppError(ErrorCode.INVALID_PARAM, message, 400);

// NOT FOUND
export const createUserNotFoundError = (message?: string) =>
    new AppError(ErrorCode.USER_NOT_FOUND, message, 404);

export const createResourceNotFoundError = (message?: string) =>
    new AppError(ErrorCode.RESOURCE_NOT_FOUND, message, 404); 