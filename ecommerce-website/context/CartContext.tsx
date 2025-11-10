'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem, CartContextType } from '@/types/cart';
import { Product } from '@/types/product';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecommerce_cart';

/**
 * Initialize cart from localStorage
 */
const getInitialCart = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: [], totalItems: 0, subtotal: 0 };
  }

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }

  return { items: [], totalItems: 0, subtotal: 0 };
};

/**
 * Cart Provider Component
 * Manages shopping cart state and persistence
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(getInitialCart);
  const [loading, setLoading] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  /**
   * Calculate cart totals
   */
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, subtotal: Math.round(subtotal * 100) / 100 };
  };

  /**
   * Add product to cart or update quantity if exists
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    setLoading(true);
    try {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex(
          (item) => item.productId === product._id
        );

        let updatedItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          updatedItems = [...prevCart.items];
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
          const maxStock = product.stock;

          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: Math.min(newQuantity, maxStock),
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, product.stock),
            imageUrl: product.imageUrl,
            maxStock: product.stock,
          };
          updatedItems = [...prevCart.items, newItem];
        }

        const totals = calculateTotals(updatedItems);
        return { items: updatedItems, ...totals };
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove product from cart
   */
  const removeFromCart = (productId: string) => {
    setLoading(true);
    try {
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter(
          (item) => item.productId !== productId
        );
        const totals = calculateTotals(updatedItems);
        return { items: updatedItems, ...totals };
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update quantity of item in cart
   */
  const updateQuantity = (productId: string, quantity: number) => {
    setLoading(true);
    try {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: Math.min(quantity, item.maxStock),
            };
          }
          return item;
        });
        const totals = calculateTotals(updatedItems);
        return { items: updatedItems, ...totals };
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setLoading(true);
    try {
      setCart({ items: [], totalItems: 0, subtotal: 0 });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get total number of items in cart
   */
  const getCartTotal = () => cart.totalItems;

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use cart context
 * Must be used within CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
