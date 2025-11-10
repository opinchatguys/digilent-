import { Router } from 'express';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';

const router = Router();

// Mount route modules
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
