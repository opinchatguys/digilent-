/**
 * Format price to 2 decimal places
 */
export const formatPrice = (price: number): number => {
    return Math.round(price * 100) / 100;
};

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random number between min and max (inclusive)
 */
export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
