import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, OrderStatus, Review } from '../types';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../constants';

interface StoreContextType {
  user: User | null;
  registeredUsers: User[];
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  orders: Order[];
  reviews: Record<string, Review[]>;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: 'CUSTOMER' | 'SELLER') => boolean;
  logout: () => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  placeOrder: (shippingAddress: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addReview: (productId: string, review: Review) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial Mock State
  const [user, setUser] = useState<User | null>(null);
  
  // Mock Database of Users
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    { id: 'admin1', name: 'Super Admin', email: 'admin@storeweb.com', password: 'admin', role: 'ADMIN' },
    { id: 'u1', name: 'John Customer', email: 'john@example.com', password: 'password', role: 'CUSTOMER' },
    { id: 's1', name: 'Jane Seller', email: 'seller@example.com', password: 'password', role: 'SELLER' }
  ]);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(MOCK_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const login = (email: string, password: string): boolean => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, role: 'CUSTOMER' | 'SELLER'): boolean => {
    if (registeredUsers.find(u => u.email === email)) {
      return false; // Email already exists
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      password,
      role
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (shippingAddress: any) => {
    if (!user) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      items: [...cart],
      total: total,
      status: OrderStatus.PENDING,
      date: new Date().toISOString(),
      shippingAddress
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Simulate Email Notification
    alert(`Confirmation Email sent to ${user.email} for Order #${newOrder.id}`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const order = orders.find(o => o.id === orderId);
    if(order) {
       console.log(`Email sent: Order #${orderId} is now ${status}`);
    }
  };

  const addReview = (productId: string, review: Review) => {
    setReviews(prev => ({
      ...prev,
      [productId]: [review, ...(prev[productId] || [])]
    }));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      user, registeredUsers, products, filteredProducts, searchQuery, setSearchQuery, cart, orders, reviews,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity,
      placeOrder, updateOrderStatus, addReview, clearCart, addProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};