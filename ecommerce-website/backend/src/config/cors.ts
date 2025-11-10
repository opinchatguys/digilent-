import { CorsOptions } from 'cors';
import { config } from './env';

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());

        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
