import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Farmer, Product, DeliveryOption } from '../types';
import { mockFarmers } from '../utils/mockData';

interface FarmerContextType {
  currentFarmer: Farmer | null;
  setCurrentFarmer: (farmer: Farmer | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'farmerId' | 'farmer' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const useFarmerContext = () => {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmerContext must be used within a FarmerProvider');
  }
  return context;
};

interface FarmerProviderProps {
  children: ReactNode;
}

export const FarmerProvider: React.FC<FarmerProviderProps> = ({ children }) => {
  // 在实际应用中，这里应该从API获取数据
  const [farmers, setFarmers] = useState<Farmer[]>(mockFarmers);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(mockFarmers[0]);

  const addProduct = (product: Omit<Product, 'id' | 'farmerId' | 'farmer' | 'createdAt' | 'updatedAt'>) => {
    if (!currentFarmer) return;

    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      farmerId: currentFarmer.id,
      farmer: currentFarmer.farmName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedFarmer = {
      ...currentFarmer,
      products: [...currentFarmer.products, newProduct],
    };

    setCurrentFarmer(updatedFarmer);
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === currentFarmer.id ? updatedFarmer : farmer
      )
    );
  };

  const updateProduct = (product: Product) => {
    if (!currentFarmer) return;

    const updatedProducts = currentFarmer.products.map(p =>
      p.id === product.id ? { ...product, updatedAt: new Date().toISOString() } : p
    );

    const updatedFarmer = {
      ...currentFarmer,
      products: updatedProducts,
    };

    setCurrentFarmer(updatedFarmer);
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === currentFarmer.id ? updatedFarmer : farmer
      )
    );
  };

  const deleteProduct = (productId: string) => {
    if (!currentFarmer) return;

    const updatedProducts = currentFarmer.products.filter(p => p.id !== productId);

    const updatedFarmer = {
      ...currentFarmer,
      products: updatedProducts,
    };

    setCurrentFarmer(updatedFarmer);
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === currentFarmer.id ? updatedFarmer : farmer
      )
    );
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (!currentFarmer) return;

    const updatedProducts = currentFarmer.products.map(p =>
      p.id === productId ? { ...p, quantity, updatedAt: new Date().toISOString() } : p
    );

    const updatedFarmer = {
      ...currentFarmer,
      products: updatedProducts,
    };

    setCurrentFarmer(updatedFarmer);
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === currentFarmer.id ? updatedFarmer : farmer
      )
    );
  };

  const value = {
    currentFarmer,
    setCurrentFarmer,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductQuantity,
  };

  return <FarmerContext.Provider value={value}>{children}</FarmerContext.Provider>;
}; 