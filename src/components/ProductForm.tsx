import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';
import { Product, DeliveryOption, ProductImage } from '../types';
import { mockDeliveryOptions } from '../utils/mockData';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'farmerId' | 'farmer' | 'createdAt' | 'updatedAt'>) => void;
  product?: Product;
}

const initialProductState = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  images: [] as ProductImage[],
  category: '',
  deliveryOptions: [] as DeliveryOption[],
};

const categories = ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Eggs', 'Grains', 'Nuts', 'Others'];

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSave, product }) => {
  const [formData, setFormData] = useState(initialProductState);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        images: product.images,
        category: product.category,
        deliveryOptions: product.deliveryOptions,
      });
      setSelectedDeliveryOptions(product.deliveryOptions.map(option => option.id));
    } else {
      setFormData(initialProductState);
      setSelectedDeliveryOptions([]);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // 清除错误
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
        
        // 清除错误
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      }
    }
  };

  const handleDeliveryOptionChange = (optionId: string) => {
    setSelectedDeliveryOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a product name';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a product description';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Please upload at least one product image';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a product category';
    }
    
    if (selectedDeliveryOptions.length === 0) {
      newErrors.deliveryOptions = 'Please select at least one delivery option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedOptions = mockDeliveryOptions.filter(option => 
        selectedDeliveryOptions.includes(option.id)
      );
      
      onSave({
        ...formData,
        deliveryOptions: selectedOptions,
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          
          <TextField
            name="description"
            label="Product Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleNumberChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
              required
            />
            
            <TextField
              name="quantity"
              label="Stock Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleNumberChange}
              fullWidth
            />
          </Box>
          
          <ImageUploader 
            images={formData.images} 
            onChange={(images) => {
              setFormData(prev => ({ ...prev, images }));
              if (errors.images) {
                setErrors(prev => ({ ...prev, images: '' }));
              }
            }}
          />
          
          <FormControl fullWidth error={!!errors.category} required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Category"
              onChange={(e) => {
                setFormData(prev => ({ ...prev, category: e.target.value as string }));
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: '' }));
                }
              }}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error">
                {errors.category}
              </Typography>
            )}
          </FormControl>
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              配送选项 <span style={{ color: 'red' }}>*</span>
            </Typography>
            <FormGroup>
              {mockDeliveryOptions.map(option => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={selectedDeliveryOptions.includes(option.id)}
                      onChange={() => handleDeliveryOptionChange(option.id)}
                    />
                  }
                  label={`${option.name} (¥${option.price})`}
                />
              ))}
            </FormGroup>
            {errors.deliveryOptions && (
              <Typography variant="caption" color="error">
                {errors.deliveryOptions}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm; 