import { Router } from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from '../controllers/cartController';

const router = Router();

// GET /api/cart - Get current cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:productId - Update item quantity
router.put('/:productId', updateCartItem);

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Clear entire cart (bonus endpoint)
router.delete('/', clearCart);

export default router;
