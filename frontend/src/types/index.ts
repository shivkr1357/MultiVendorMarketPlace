// Frontend types for React application

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "vendor" | "admin";
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  vendorId: string;
  vendor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, any>;
  // Amazon product fields
  url?: string;
  product_id?: string;
  brand?: string;
  features?: string[];
  availability_status?: string;
  prime_eligible?: boolean;
  free_delivery?: boolean;
  seller?: string;
  scraped_at?: string;
  image_alt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  _id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customer: User;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "stripe";
  last4?: string;
  brand?: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "customer" | "vendor";
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  statusCode: number;
}

// Form types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// UI types
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Filter types
export interface ProductFilters {
  search: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Cart types
export interface LocalCartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavItem[];
}

export interface Breadcrumb {
  label: string;
  path?: string;
}

// Theme types
export interface Theme {
  mode: "light" | "dark";
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Notification types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
