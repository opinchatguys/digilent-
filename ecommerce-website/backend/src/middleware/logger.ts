import { Request, Response, NextFunction } from 'express';

/**
 * Request logger middleware
 */
export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.socket.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    next();
};
