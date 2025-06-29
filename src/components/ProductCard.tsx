import React, { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon
} from '@mui/icons-material';
import { Product } from '../types';
import { useFarmerContext } from '../context/FarmerContext';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const { deleteProduct, updateProductQuantity } = useFarmerContext();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteProduct(product.id);
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
      updateProductQuantity(product.id, newQuantity);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateProductQuantity(product.id, newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateProductQuantity(product.id, newQuantity);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={product.images.find(img => img.isMain)?.url || product.images[0]?.url}
          alt={product.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Chip label={`¥${product.price.toFixed(2)}`} color="primary" size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.primary">
                Category: {product.category}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.primary" sx={{ mr: 2 }}>
                  Stock:
                </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" onClick={decrementQuantity}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  size="small"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ 
                    style: { textAlign: 'center', width: '40px', padding: '2px' },
                    min: 0
                  }}
                />
                <IconButton size="small" onClick={incrementQuantity}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard; 