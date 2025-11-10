'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { API_ENDPOINTS } from '@/lib/api';
import { getAPI } from '@/lib/fetchHelpers';
import { ShoppingCart, Loader2 } from 'lucide-react';

/**
 * Mock Products Data (Fallback when backend is unavailable)
 */
const getMockProducts = (): Product[] => [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    price: 99.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 50,
    rating: 4.5,
  },
  {
    _id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
    price: 149.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 35,
    rating: 4.3,
  },
  {
    _id: '3',
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket made from premium cotton. Perfect for casual wear in any season.',
    price: 79.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    stock: 100,
    rating: 4.7,
  },
  {
    _id: '4',
    name: 'JavaScript: The Definitive Guide',
    description: 'Master JavaScript with this comprehensive guide covering ES6+ features and modern web development.',
    price: 49.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    stock: 75,
    rating: 4.8,
  },
  {
    _id: '5',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep drinks cold for 24 hours or hot for 12 hours. Double-walled vacuum insulated, BPA-free.',
    price: 24.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    stock: 150,
    rating: 4.6,
  },
  {
    _id: '6',
    name: 'Yoga Mat with Carrying Strap',
    description: 'Premium non-slip yoga mat with extra cushioning. Includes carrying strap for easy transport.',
    price: 34.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    stock: 80,
    rating: 4.4,
  },
  {
    _id: '7',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable keys and anti-ghosting technology.',
    price: 89.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 45,
    rating: 4.6,
  },
  {
    _id: '8',
    name: 'Cotton T-Shirt Pack (3-Pack)',
    description: 'Set of 3 comfortable cotton t-shirts in classic colors. Soft, breathable, pre-shrunk.',
    price: 29.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock: 200,
    rating: 4.5,
  },
];

/**
 * Product List Component
 * Displays a grid of all products
 */
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetch products from backend API
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const data = await getAPI<Product[]>(API_ENDPOINTS.products.getAll());
        setProducts(data || []);
      } catch (apiError) {
        // If API fails, use mock data
        console.warn('API failed, using mock data:', apiError);
        setProducts(getMockProducts());
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add product to cart
   */
  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation when clicking add to cart
    event.stopPropagation();
    
    try {
      addToCart(product, 1);
      // Visual feedback - you can replace with toast notification
      console.log(`Added ${product.name} to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-extrabold text-white mb-12 text-center drop-shadow-2xl">Our Premium Products</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="glass-effect rounded-2xl shadow-2xl overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 border border-white/40 hover:scale-105 hover:-translate-y-2 group"
          >
            {/* Product Image */}
            <Link href={`/products/${product._id}`}>
              <div className="relative h-56 bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-lg">Out of Stock</span>
                  </div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Only {product.stock} left!
                  </div>
                )}
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-5 bg-white/20 backdrop-blur-sm">
              <Link href={`/products/${product._id}`}>
                <h3 className="text-lg font-bold text-white hover:text-yellow-300 mb-2 line-clamp-2 drop-shadow-md">
                  {product.name}
                </h3>
              </Link>

              <p className="text-white/90 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-white drop-shadow-lg">
                  ${product.price.toFixed(2)}
                </span>

                {product.rating && (
                  <span className="text-sm text-yellow-300 font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    ⭐ {product.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 transform ${
                  product.stock === 0
                    ? 'bg-gray-400/50 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
