'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { API_ENDPOINTS } from '@/lib/api';
import { getAPI } from '@/lib/fetchHelpers';
import { ShoppingCart, Loader2, ArrowLeft, Minus, Plus } from 'lucide-react';

/**
 * Mock Products Data (Fallback when backend is unavailable)
 */
const getMockProductById = (id: string): Product | null => {
  const mockProducts: Product[] = [
    {
      _id: '1',
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
    },
    {
      _id: '2',
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
      price: 149.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      stock: 35,
      rating: 4.3,
    },
    {
      _id: '3',
      name: 'Classic Denim Jacket',
      description: 'Timeless denim jacket made from premium cotton. Perfect for casual wear in any season. Available in multiple sizes.',
      price: 79.99,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      stock: 100,
      rating: 4.7,
    },
    {
      _id: '4',
      name: 'JavaScript: The Definitive Guide',
      description: 'Master JavaScript with this comprehensive guide covering ES6+ features, async programming, and modern web development techniques.',
      price: 49.99,
      category: 'Books',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
      stock: 75,
      rating: 4.8,
    },
    {
      _id: '5',
      name: 'Stainless Steel Water Bottle',
      description: 'Keep your drinks cold for 24 hours or hot for 12 hours with this double-walled vacuum insulated water bottle. BPA-free and eco-friendly.',
      price: 24.99,
      category: 'Home',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      stock: 150,
      rating: 4.6,
    },
    {
      _id: '6',
      name: 'Yoga Mat with Carrying Strap',
      description: 'Premium non-slip yoga mat with extra cushioning for comfort. Includes carrying strap for easy transport. Perfect for yoga, pilates, and exercise.',
      price: 34.99,
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      stock: 80,
      rating: 4.4,
    },
    {
      _id: '7',
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with customizable keys, anti-ghosting technology, and durable switches rated for 50 million keystrokes.',
      price: 89.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      stock: 45,
      rating: 4.6,
    },
    {
      _id: '8',
      name: 'Cotton T-Shirt Pack (3-Pack)',
      description: 'Set of 3 comfortable cotton t-shirts in classic colors. Soft, breathable fabric perfect for everyday wear. Pre-shrunk and colorfast.',
      price: 29.99,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      stock: 200,
      rating: 4.5,
    },
  ];
  
  return mockProducts.find(p => p._id === id) || null;
};

interface ProductDetailProps {
  productId: string;
}

/**
 * Product Detail Component
 * Displays detailed information about a single product
 */
export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  /**
   * Fetch product details from backend API
   */
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const data = await getAPI<Product>(API_ENDPOINTS.products.getById(productId));
        setProduct(data);
      } catch (apiError) {
        // If API fails, use mock data
        console.warn('API failed, using mock data:', apiError);
        const mockProduct = getMockProductById(productId);
        if (mockProduct) {
          setProduct(mockProduct);
        } else {
          throw new Error('Product not found');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
      setError(errorMessage);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle quantity change with validation
   */
  const handleQuantityChange = (delta: number) => {
    const newQuantity = selectedQuantity + delta;
    const maxStock = product?.stock || 0;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setSelectedQuantity(newQuantity);
    }
  };

  /**
   * Add product to cart with selected quantity
   */
  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addToCart(product, selectedQuantity);
      
      // Visual feedback
      console.log(`Added ${selectedQuantity} x ${product.name} to cart`);
      
      // Optional: Navigate to cart after adding
      // router.push('/cart');
      
      // Reset quantity to 1 after adding
      setSelectedQuantity(1);
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
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error: {error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden aspect-square border border-white/20 shadow-xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.rating && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐ {product.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">Rating</span>
              </div>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <p className="text-4xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={selectedQuantity <= 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{selectedQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedQuantity >= product.stock}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                Add {selectedQuantity} to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
