import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
    port: number;
    nodeEnv: string;
    mongodbUri: string;
    corsOrigin: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
};

export const config: EnvConfig = {
    port: parseInt(getEnvVariable('PORT', '5000'), 10),
    nodeEnv: getEnvVariable('NODE_ENV', 'development'),
    mongodbUri: getEnvVariable('MONGODB_URI'),
    corsOrigin: getEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
};
