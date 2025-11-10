'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';

/**
 * Navigation Bar Component
 * Displays site navigation and cart badge with mobile menu
 */
export default function Navbar() {
  const { getCartTotal } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by only showing cart count after mount
  useEffect(() => {
    setMounted(true);
    setCartItemCount(getCartTotal());
  }, [getCartTotal]);

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-extrabold text-white drop-shadow-lg hover:scale-110 transition-transform duration-300"
            >
              🛒 E-Shop
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-yellow-300 font-semibold transition-all duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="text-white hover:text-yellow-300 font-semibold transition-all duration-200 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative flex items-center text-white hover:text-yellow-300 transition-all duration-200 group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg ring-2 ring-white">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700"
            >
              <ShoppingCart className="h-6 w-6" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-md transition-all"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-md transition-all"
              >
                Products
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-md transition-all flex items-center justify-between"
              >
                <span>Shopping Cart</span>
                {mounted && cartItemCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartItemCount} items
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
