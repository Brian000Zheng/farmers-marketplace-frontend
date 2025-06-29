import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useFarmerContext } from '../context/FarmerContext';

const SalesPage: React.FC = () => {
  const { currentFarmer } = useFarmerContext();
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  const handleChartTypeChange = (_event: React.SyntheticEvent, newValue: string) => {
    setChartType(newValue);
  };

  const salesData = currentFarmer?.salesData || [];

  // Calculate total revenue, orders, and products sold
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalProducts = salesData.reduce((sum, day) => sum + day.products, 0);

  // Stats card data
  const statsCards = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#4caf50' },
    { title: 'Total Orders', value: totalOrders, color: '#2196f3' },
    { title: 'Total Products Sold', value: totalProducts, color: '#ff9800' },
    { title: 'Average Order Value', value: `$${(totalRevenue / totalOrders).toFixed(2)}`, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Sales Analytics
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {statsCards.map((card, index) => (
          <Card key={index} sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ color: card.color }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Sales Trends</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value as string)}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
            <Tabs value={chartType} onChange={handleChartTypeChange}>
              <Tab label="Line Chart" value="line" />
              <Tab label="Bar Chart" value="bar" />
            </Tabs>
          </Box>
        </Box>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#82ca9d"
                />
              </LineChart>
            ) : (
              <BarChart
                data={salesData}
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
                <Bar dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
                <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Revenue ($)</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Products Sold</TableCell>
                <TableCell align="right">Avg. Order Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.revenue.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.orders}</TableCell>
                  <TableCell align="right">{row.products}</TableCell>
                  <TableCell align="right">
                    {(row.revenue / row.orders).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesPage; 