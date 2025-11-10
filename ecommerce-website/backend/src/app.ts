import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

const app: Application = express();

// ============================================
// Middleware
// ============================================

// Request logging
app.use(requestLogger);

// CORS - Enable Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// Body parser - Parse JSON request bodies
app.use(express.json());

// Body parser - Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'E-Commerce API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
        },
    });
});

// ============================================
// Error Handling
// ============================================

// 404 handler - Must be after all other routes
app.use(notFoundHandler);

// Global error handler - Must be last
app.use(errorHandler);

export default app;
