// Product type definitions
export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  file?: File; // Optional property to store the uploaded file object
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
  category: string;
  farmer: string;
  farmerId: string;
  deliveryOptions: DeliveryOption[];
  createdAt: string;
  updatedAt: string;
}

// Delivery option type
export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
}

// Sales data type
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  products: number;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'customer' | 'admin';
}

// Farmer type
export interface Farmer extends User {
  farmName: string;
  description: string;
  location: string;
  products: Product[];
  salesData: SalesData[];
} 