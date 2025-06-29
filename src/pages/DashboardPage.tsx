import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Grid
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useFarmerContext } from '../context/FarmerContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardPage: React.FC = () => {
  const { currentFarmer } = useFarmerContext();
  const navigate = useNavigate();

  if (!currentFarmer) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5">No farmer data found</Typography>
      </Box>
    );
  }

  const salesData = currentFarmer.salesData || [];
  const products = currentFarmer.products || [];

  // Calculate total revenue, orders, and products sold
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalProducts = salesData.reduce((sum, day) => sum + day.products, 0);

  // Get recent sales data
  const recentSalesData = salesData.slice(-5);

  // Get products with low stock
  const lowStockProducts = products.filter(product => product.quantity < 10);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome, {currentFarmer.name}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingBasketIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="text.secondary">Total Orders</Typography>
                <Typography variant="h4">{totalOrders}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="text.secondary">Product Count</Typography>
                <Typography variant="h4">{products.length}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Paper sx={{ flex: 2, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Sales Trends</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={recentSalesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/sales')}
            >
              View Detailed Sales Data
            </Button>
          </Box>
        </Paper>
        
        <Paper sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningIcon sx={{ color: 'warning.main', mr: 1 }} />
            <Typography variant="h6">Low Stock Alert</Typography>
          </Box>
          
          {lowStockProducts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              All products have sufficient stock
            </Typography>
          ) : (
            <List>
              {lowStockProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                      secondary={`Stock: ${product.quantity} units`}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate('/products')}
                    >
                      Manage
                    </Button>
                  </ListItem>
                  {index < lowStockProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/products')}
            >
              Manage All Products
            </Button>
          </Box>
        </Paper>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Farm Information</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Farm Name:</strong> {currentFarmer.farmName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Location:</strong> {currentFarmer.location}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Contact Person:</strong> {currentFarmer.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {currentFarmer.email}
            </Typography>
          </Box>
          <Box sx={{ flex: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Farm Description:</strong>
            </Typography>
            <Typography variant="body1">
              {currentFarmer.description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardPage; 