import mongoose from 'mongoose';
import { Product } from '../models';
import { config } from '../config/env';

/**
 * Sample products data for testing
 */
const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and commuters.',
        price: 99.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        ],
        stock: 50,
        rating: 4.5,
        specifications: {
            brand: 'AudioTech',
            color: 'Black',
            weight: '250g',
            connectivity: 'Bluetooth 5.0',
        },
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
        price: 149.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        ],
        stock: 35,
        rating: 4.3,
        specifications: {
            brand: 'FitTech',
            color: 'Silver',
            display: '1.4 inch AMOLED',
            waterResistant: '5ATM',
        },
    },
    {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket made from premium cotton. Perfect for casual wear in any season. Available in multiple sizes.',
        price: 79.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        ],
        stock: 100,
        rating: 4.7,
        specifications: {
            material: '100% Cotton',
            fit: 'Regular',
            care: 'Machine washable',
        },
    },
    {
        name: 'JavaScript: The Definitive Guide',
        description: 'Master JavaScript with this comprehensive guide covering ES6+ features, async programming, and modern web development techniques.',
        price: 49.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        images: [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        ],
        stock: 75,
        rating: 4.8,
        specifications: {
            author: 'David Flanagan',
            publisher: 'O\'Reilly Media',
            pages: '706',
            edition: '7th Edition',
        },
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Keep your drinks cold for 24 hours or hot for 12 hours with this double-walled vacuum insulated water bottle. BPA-free and eco-friendly.',
        price: 24.99,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
        ],
        stock: 150,
        rating: 4.6,
        specifications: {
            capacity: '750ml',
            material: 'Stainless Steel',
            color: 'Navy Blue',
        },
    },
    {
        name: 'Yoga Mat with Carrying Strap',
        description: 'Premium non-slip yoga mat with extra cushioning for comfort. Includes carrying strap for easy transport. Perfect for yoga, pilates, and exercise.',
        price: 34.99,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        images: [
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        ],
        stock: 80,
        rating: 4.4,
        specifications: {
            thickness: '6mm',
            material: 'TPE',
            dimensions: '183cm x 61cm',
            color: 'Purple',
        },
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with customizable keys, anti-ghosting technology, and durable switches rated for 50 million keystrokes.',
        price: 89.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        ],
        stock: 45,
        rating: 4.6,
        specifications: {
            brand: 'GameTech',
            switches: 'Cherry MX Red',
            connectivity: 'USB-C',
            lighting: 'RGB',
        },
    },
    {
        name: 'Cotton T-Shirt Pack (3-Pack)',
        description: 'Set of 3 comfortable cotton t-shirts in classic colors. Soft, breathable fabric perfect for everyday wear. Pre-shrunk and colorfast.',
        price: 29.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        ],
        stock: 200,
        rating: 4.5,
        specifications: {
            material: '100% Cotton',
            colors: 'Black, White, Gray',
            fit: 'Regular',
        },
    },
    {
        name: 'Python Programming: From Beginner to Pro',
        description: 'Learn Python programming from scratch with practical examples, exercises, and real-world projects. Includes code samples and online resources.',
        price: 39.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
        images: [
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
        ],
        stock: 60,
        rating: 4.7,
        specifications: {
            author: 'John Smith',
            publisher: 'TechBooks Publishing',
            pages: '512',
            format: 'Paperback',
        },
    },
    {
        name: 'Portable Bluetooth Speaker',
        description: '360-degree sound with deep bass, waterproof design (IPX7), 12-hour battery life. Perfect for outdoor adventures and parties.',
        price: 59.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        ],
        stock: 70,
        rating: 4.4,
        specifications: {
            brand: 'SoundWave',
            waterproof: 'IPX7',
            battery: '12 hours',
            connectivity: 'Bluetooth 5.0',
        },
    },
];

/**
 * Seed database with sample products
 */
const seedDatabase = async (): Promise<void> => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products`);

        // Insert sample products
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

        // Display seeded products summary
        console.log('\n📦 Seeded Products:');
        insertedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`);
        });

        console.log('\n✨ Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
};

// Run seeding
seedDatabase();
