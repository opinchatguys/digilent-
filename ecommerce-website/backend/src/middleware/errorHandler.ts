import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    stack?: string;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.message,
        });
        return;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            error: err.message,
        });
        return;
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        res.status(400).json({
            success: false,
            message: 'Duplicate field value',
            error: 'Resource already exists',
        });
        return;
    }

    // Default error response
    const response: ErrorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(500).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
