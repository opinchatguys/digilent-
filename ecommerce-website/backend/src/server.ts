import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';

/**
 * Start the Express server
 */
const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Start listening on the configured port
        const PORT = config.port;

        app.listen(PORT, () => {
            console.log('========================================');
            console.log(`🚀 Server running in ${config.nodeEnv} mode`);
            console.log(`🌐 Server URL: http://localhost:${PORT}`);
            console.log(`📡 API Base: http://localhost:${PORT}/api`);
            console.log('========================================');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();
