// API Response Messages
export const MESSAGES = {
    // Success messages
    SUCCESS: {
        PRODUCT_CREATED: 'Product created successfully',
        PRODUCT_UPDATED: 'Product updated successfully',
        PRODUCT_DELETED: 'Product deleted successfully',
        CART_UPDATED: 'Cart updated successfully',
    },
    // Error messages
    ERROR: {
        SERVER_ERROR: 'Internal server error',
        NOT_FOUND: 'Resource not found',
        INVALID_ID: 'Invalid ID format',
        VALIDATION_ERROR: 'Validation error',
        PRODUCT_NOT_FOUND: 'Product not found',
        INSUFFICIENT_STOCK: 'Insufficient stock available',
    },
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};

// Product categories
export const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Other',
] as const;

export type Category = typeof CATEGORIES[number];
