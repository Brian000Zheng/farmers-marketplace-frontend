import { Product, DeliveryOption, SalesData, Farmer } from '../types';

// Mock delivery options
export const mockDeliveryOptions: DeliveryOption[] = [
  { id: '1', name: 'Self-pickup', price: 0 },
  { id: '2', name: 'Local delivery', price: 10 },
  { id: '3', name: 'Nationwide shipping', price: 20 },
];

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Carrots',
    description: 'Freshly harvested organic carrots, no pesticides, no fertilizers.',
    price: 5.99,
    quantity: 100,
    images: [
      { id: '1-1', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37', isMain: true },
      { id: '1-2', url: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f', isMain: false },
      { id: '1-3', url: 'https://images.unsplash.com/photo-1582515073490-39c7cb780c6b', isMain: false }
    ],
    category: 'Vegetables',
    farmer: 'Green Farm',
    farmerId: '1',
    deliveryOptions: mockDeliveryOptions,
    createdAt: new Date(2023, 5, 10).toISOString(),
    updatedAt: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: '2',
    name: 'Fresh Strawberries',
    description: 'Seasonal fresh strawberries, sweet and tangy.',
    price: 15.99,
    quantity: 50,
    images: [
      { id: '2-1', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6', isMain: true },
      { id: '2-2', url: 'https://images.unsplash.com/photo-1543158181-e6f9f6712055', isMain: false }
    ],
    category: 'Fruits',
    farmer: 'Green Farm',
    farmerId: '1',
    deliveryOptions: mockDeliveryOptions,
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: '3',
    name: 'Organic Potatoes',
    description: 'Farm-direct organic potatoes with a creamy texture.',
    price: 3.99,
    quantity: 200,
    images: [
      { id: '3-1', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655', isMain: true },
      { id: '3-2', url: 'https://images.unsplash.com/photo-1591280063242-56199a325c4c', isMain: false },
      { id: '3-3', url: 'https://images.unsplash.com/photo-1635774855317-edf3ee4463db', isMain: false }
    ],
    category: 'Vegetables',
    farmer: 'Harvest Farm',
    farmerId: '2',
    deliveryOptions: mockDeliveryOptions.slice(0, 2),
    createdAt: new Date(2023, 5, 20).toISOString(),
    updatedAt: new Date(2023, 5, 20).toISOString(),
  },
];

// Mock sales data
export const mockSalesData: SalesData[] = [
  { date: '2023-05-01', revenue: 1200, orders: 24, products: 120 },
  { date: '2023-05-02', revenue: 1500, orders: 30, products: 150 },
  { date: '2023-05-03', revenue: 1000, orders: 20, products: 100 },
  { date: '2023-05-04', revenue: 1800, orders: 36, products: 180 },
  { date: '2023-05-05', revenue: 2000, orders: 40, products: 200 },
  { date: '2023-05-06', revenue: 1700, orders: 34, products: 170 },
  { date: '2023-05-07', revenue: 2200, orders: 44, products: 220 },
];

// Mock farmer data
export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'farmer',
    farmName: 'Green Farm',
    description: 'Focused on organic produce for 20 years',
    location: 'Countryside, California',
    products: mockProducts.filter(p => p.farmerId === '1'),
    salesData: mockSalesData,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'farmer',
    farmName: 'Harvest Farm',
    description: 'Family farm, passed down for three generations',
    location: 'Rural Valley, Oregon',
    products: mockProducts.filter(p => p.farmerId === '2'),
    salesData: mockSalesData.map(item => ({
      ...item,
      revenue: item.revenue * 0.8,
      orders: Math.floor(item.orders * 0.8),
      products: Math.floor(item.products * 0.8),
    })),
  },
]; 