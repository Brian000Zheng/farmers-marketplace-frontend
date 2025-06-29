import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  InputBase,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';

import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import { useFarmerContext } from '../context/FarmerContext';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const { currentFarmer, addProduct, updateProduct } = useFarmerContext();
  const [openProductForm, setOpenProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setOpenProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenProductForm(true);
  };

  const handleSaveProduct = (product: Omit<Product, 'id' | 'farmerId' | 'farmer' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      updateProduct({
        ...selectedProduct,
        ...product,
      });
    } else {
      addProduct(product);
    }
  };

  const handleCloseForm = () => {
    setOpenProductForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(e.target.value as string);
  };

  const filteredProducts = currentFarmer?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  // 获取所有产品的类别
  const categories = currentFarmer?.products
    ? Array.from(new Set(currentFarmer.products.map(p => p.category)))
    : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add New Product
        </Button>
      </Box>

      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value as string)}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new product or modify your search criteria
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1.5 }}>
          {filteredProducts.map(product => (
            <Box 
              key={product.id}
              sx={{ 
                width: { 
                  xs: '100%', 
                  sm: '50%', 
                  md: '33.33%', 
                  lg: '25%' 
                }, 
                padding: 1.5 
              }}
            >
              <ProductCard 
                product={product} 
                onEdit={handleEditProduct} 
              />
            </Box>
          ))}
        </Box>
      )}

      <ProductForm
        open={openProductForm}
        onClose={handleCloseForm}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </Box>
  );
};

export default ProductsPage; 