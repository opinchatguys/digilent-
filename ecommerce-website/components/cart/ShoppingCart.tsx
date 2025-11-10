'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

/**
 * Shopping Cart Component
 * Displays cart items and allows quantity updates
 */
export default function ShoppingCart() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-2xl">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-white bg-red-500/80 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="glass-effect rounded-2xl shadow-2xl p-6 flex items-center gap-6 border border-white/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{item.name}</h3>
                <p className="text-white/90 mb-2">${item.price.toFixed(2)} each</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {item.quantity >= item.maxStock && (
                    <span className="text-xs text-amber-600">Max stock reached</span>
                  )}
                </div>
              </div>

              {/* Subtotal and Remove */}
              <div className="flex flex-col items-end gap-4">
                <p className="text-2xl font-extrabold text-white drop-shadow-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-300 hover:text-red-500 transition-colors bg-white/20 p-2 rounded-lg hover:bg-white/30"
                  title="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl shadow-2xl p-8 sticky top-24 border border-white/40">
            <h2 className="text-2xl font-extrabold text-white mb-6 drop-shadow-lg">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-white/90 text-lg">
                <span>Items ({cart.totalItems})</span>
                <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/90 text-lg">
                <span>Shipping</span>
                <span className="text-green-300 font-bold">FREE</span>
              </div>
              <div className="border-t border-white/30 pt-4">
                <div className="flex justify-between text-2xl font-extrabold text-white drop-shadow-lg">
                  <span>Total</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Checkout feature coming soon!')}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 transition-all duration-300 mb-4 shadow-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transform hover:scale-105 active:scale-95"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
