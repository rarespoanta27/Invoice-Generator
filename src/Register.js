import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    type: 'fizica',
    name: '',
    CUI: '',
    billingAddress: '',
    homeAddress: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', formData);
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      alert('Failed to register user. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="type-label"></InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="fizica">Persoana Fizica</MenuItem>
                    <MenuItem value="juridica">Persoana Juridica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label={formData.type === 'fizica' ? 'Nume Prenume' : 'Nume Firma'}
                  id="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              {formData.type === 'juridica' && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="CUI"
                    label="CUI"
                    id="CUI"
                    autoComplete="cui"
                    value={formData.CUI}
                    onChange={handleChange}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="billingAddress"
                  label="Adresa de Facturare"
                  id="billingAddress"
                  autoComplete="billing-address"
                  value={formData.billingAddress}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="homeAddress"
                  label={formData.type === 'fizica' ? 'Adresa Domiciliu' : 'Adresa Firma'}
                  id="homeAddress"
                  autoComplete="home-address"
                  value={formData.homeAddress}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Telefon"
                  id="phone"
                  autoComplete="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
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
    </ThemeProvider>
  );
}

export default Register;
