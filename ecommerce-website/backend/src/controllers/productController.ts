import { Request, Response } from 'express';
import { Product } from '../models';
import { PAGINATION, MESSAGES } from '../utils/constants';
import { isValidObjectId } from '../utils/helpers';

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Public
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
        const limit = Math.min(
            parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
            PAGINATION.MAX_LIMIT
        );
        const category = req.query.category as string;
        const sort = req.query.sort as string || 'createdAt';
        const order = req.query.order as string === 'asc' ? 1 : -1;

        // Build filter object
        const filter: any = {};
        if (category) {
            filter.category = category;
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sortObject: any = {};
        sortObject[sort] = order;

        // Fetch products with pagination
        const products = await Product.find(filter)
            .sort(sortObject)
            .skip(skip)
            .limit(limit)
            .select('-__v'); // Exclude __v field

        // Get total count for pagination
        const totalItems = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Find product by ID
        const product = await Product.findById(id).select('-__v');

        // Check if product exists
        if (!product) {
            res.status(404).json({
                success: false,
                message: MESSAGES.ERROR.PRODUCT_NOT_FOUND,
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, imageUrl, images, stock, specifications } = req.body;

        // Validate required fields
        if (!name || !description || price === undefined || !category || !imageUrl) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: 'Missing required fields: name, description, price, category, imageUrl',
            });
            return;
        }

        // Create new product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            imageUrl,
            images: images || [],
            stock: stock || 0,
            specifications: specifications || {},
        });

        res.status(201).json({
            success: true,
            message: MESSAGES.SUCCESS.PRODUCT_CREATED,
            data: product,
        });
    } catch (error) {
        console.error('Error in createProduct:', error);

        // Handle validation errors
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: error instanceof Error ? error.message : 'Validation failed',
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Update product
        const product = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-__v');

        // Check if product exists
        if (!product) {
            res.status(404).json({
                success: false,
                message: MESSAGES.ERROR.PRODUCT_NOT_FOUND,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: MESSAGES.SUCCESS.PRODUCT_UPDATED,
            data: product,
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);

        // Handle validation errors
        if ((error as any).name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: error instanceof Error ? error.message : 'Validation failed',
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Delete product
        const product = await Product.findByIdAndDelete(id);

        // Check if product exists
        if (!product) {
            res.status(404).json({
                success: false,
                message: MESSAGES.ERROR.PRODUCT_NOT_FOUND,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: MESSAGES.SUCCESS.PRODUCT_DELETED,
            data: { id },
        });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
