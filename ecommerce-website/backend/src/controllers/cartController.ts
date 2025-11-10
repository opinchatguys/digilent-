import { Request, Response } from 'express';
import { Cart, Product } from '../models';
import { MESSAGES } from '../utils/constants';
import { isValidObjectId } from '../utils/helpers';

// Fixed cart ID for sessionless implementation
// In a real app, this would be tied to user session or JWT token
const DEFAULT_CART_ID = 'defaultCart';

/**
 * @route   GET /api/cart
 * @desc    Get the current shopping cart
 * @access  Public
 */
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find or create default cart
        let cart = await Cart.findOne({ sessionId: DEFAULT_CART_ID }).populate('items.productId');

        // If cart doesn't exist, create an empty one
        if (!cart) {
            cart = await Cart.create({
                sessionId: DEFAULT_CART_ID,
                items: [],
            });
        }

        // Calculate cart totals
        const cartItems = cart.items.map((item: any) => {
            const product = item.productId;
            return {
                productId: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: item.quantity,
                subtotal: product.price * item.quantity,
                inStock: product.stock >= item.quantity,
            };
        });

        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

        res.status(200).json({
            success: true,
            data: {
                items: cartItems,
                totalItems,
                subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
            },
        });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart or update quantity if exists
 * @access  Public
 */
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body;

        // Validate request body
        if (!productId || !quantity) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: 'productId and quantity are required',
            });
            return;
        }

        // Validate productId format
        if (!isValidObjectId(productId)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Validate quantity
        if (quantity < 1 || !Number.isInteger(quantity)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: 'Quantity must be a positive integer',
            });
            return;
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: MESSAGES.ERROR.PRODUCT_NOT_FOUND,
            });
            return;
        }

        // Check stock availability
        if (product.stock < quantity) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INSUFFICIENT_STOCK,
                error: `Only ${product.stock} items available in stock`,
            });
            return;
        }

        // Find or create cart
        let cart = await Cart.findOne({ sessionId: DEFAULT_CART_ID });
        if (!cart) {
            cart = await Cart.create({
                sessionId: DEFAULT_CART_ID,
                items: [],
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            // Check stock for new quantity
            if (product.stock < newQuantity) {
                res.status(400).json({
                    success: false,
                    message: MESSAGES.ERROR.INSUFFICIENT_STOCK,
                    error: `Only ${product.stock} items available. You already have ${cart.items[existingItemIndex].quantity} in cart.`,
                });
                return;
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({
                productId: product._id,
                quantity,
            } as any);
        }

        // Save cart
        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({ sessionId: DEFAULT_CART_ID }).populate('items.productId');

        res.status(200).json({
            success: true,
            message: MESSAGES.SUCCESS.CART_UPDATED,
            data: updatedCart,
        });
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update quantity of a specific item in cart
 * @access  Public
 */
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validate productId format
        if (!isValidObjectId(productId)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Validate quantity
        if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.VALIDATION_ERROR,
                error: 'Quantity must be a positive integer',
            });
            return;
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: MESSAGES.ERROR.PRODUCT_NOT_FOUND,
            });
            return;
        }

        // Check stock availability
        if (product.stock < quantity) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INSUFFICIENT_STOCK,
                error: `Only ${product.stock} items available in stock`,
            });
            return;
        }

        // Find cart
        const cart = await Cart.findOne({ sessionId: DEFAULT_CART_ID });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
            return;
        }

        // Find item in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'Product not found in cart',
            });
            return;
        }

        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({ sessionId: DEFAULT_CART_ID }).populate('items.productId');

        res.status(200).json({
            success: true,
            message: MESSAGES.SUCCESS.CART_UPDATED,
            data: updatedCart,
        });
    } catch (error) {
        console.error('Error in updateCartItem:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove an item from the cart
 * @access  Public
 */
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;

        // Validate productId format
        if (!isValidObjectId(productId)) {
            res.status(400).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_ID,
            });
            return;
        }

        // Find cart
        const cart = await Cart.findOne({ sessionId: DEFAULT_CART_ID });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
            return;
        }

        // Find item index in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'Product not found in cart',
            });
            return;
        }

        // Remove item from cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({ sessionId: DEFAULT_CART_ID }).populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: updatedCart,
        });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items from cart
 * @access  Public
 */
export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find cart
        const cart = await Cart.findOne({ sessionId: DEFAULT_CART_ID });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
            return;
        }

        // Clear all items
        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart,
        });
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(500).json({
            success: false,
            message: MESSAGES.ERROR.SERVER_ERROR,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
