import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Grid, Paper, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function GenerateInvoice() {
  const [details, setDetails] = useState({
    products: [{ name: '', price: 0, quantity: 1 }],
    transport: 0,
    total: 0
  });

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('product')) {
      const newProducts = [...details.products];
      newProducts[index][name.split('.')[1]] = value;
      setDetails({ ...details, products: newProducts });
    } else {
      setDetails({ ...details, [name]: value });
    }
  };

  const addProduct = () => {
    setDetails({ ...details, products: [...details.products, { name: '', price: 0, quantity: 1 }] });
  };

  const removeProduct = (index) => {
    const newProducts = details.products.filter((_, i) => i !== index);
    setDetails({ ...details, products: newProducts });
  };

  useEffect(() => {
    const calculateTotal = () => {
      const productTotal = details.products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      const total = productTotal + parseFloat(details.transport);
      setDetails((prevDetails) => ({ ...prevDetails, total }));
    };

    calculateTotal();
  }, [details.products, details.transport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/generate-invoice', { token, details });
      alert('Invoice generated and sent successfully');
    } catch (error) {
      console.error('Error generating invoice:', error.response ? error.response.data : error.message);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Generate Invoice
        </Typography>
        <form onSubmit={handleSubmit}>
          {details.products.map((product, index) => (
            <Box key={index} mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Product Name"
                    name={`product.name`}
                    value={product.name}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Product Price"
                    name={`product.price`}
                    type="number"
                    value={product.price}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Quantity"
                    name={`product.quantity`}
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => removeProduct(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box my={2}>
            <Button type="button" fullWidth variant="contained" color="primary" onClick={addProduct}>
              Add Product
            </Button>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            label="Transport Cost"
            name="transport"
            type="number"
            value={details.transport}
            onChange={handleChange}
            required
            margin="normal"
          />
          <Typography variant="h6" align="right" gutterBottom>
            Total: {details.total.toFixed(2)} lei
          </Typography>
          <Box mt={3}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Generate Invoice
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </form>
      </Paper>
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="textSecondary" align="center">
          Developed by Rares Poanta
        </Typography>
      </Box>
    </Container>
  );
}

export default GenerateInvoice;
