import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Chip
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh
} from '@mui/icons-material';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productsAPI } from '../../api/products';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Ֆիլտրացման պարամետրեր
  // Filter parameters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  // Ապրանքների բեռնում
  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const filterParams = {};
      if (filters.category) filterParams.category = filters.category;
      if (filters.minPrice) filterParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) filterParams.maxPrice = parseFloat(filters.maxPrice);
      
      const data = await productsAPI.getProducts(filterParams);
      
      // Որոնման ֆիլտր (կլիենտի կողմից)
      // Search filter (client-side)
      let filteredProducts = data;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = data.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Կատեգորիաների բեռնում
  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await productsAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Կատեգորիաների բեռնման սխալ:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  // Ֆիլտրերի կիրառում
  // Apply filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [loadProducts]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Իսկապե՞ս ուզում եք ջնջել "${product.name}" ապրանքը:`)) {
      try {
        await productsAPI.deleteProduct(product.id);
        await loadProducts(); // Reload products
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Box>
      {/* Վերնագիր
          Title */}
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
          mb: 4
        }}
      >
        Բազար Բլոտ
      </Typography>

      <Typography 
        variant="h6" 
        component="p" 
        gutterBottom
        sx={{ 
          textAlign: 'center',
          color: 'text.secondary',
          mb: 4
        }}
      >
        Գտեք լավագույն ապրանքները մեր առցանց խանութից
      </Typography>

      {/* Ֆիլտրներ
          Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Ֆիլտրներ</Typography>
        </Box>
        
        <Grid container spacing={2}>
          {/* Որոնում
              Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Որոնել ապրանք"
              variant="outlined"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          {/* Կատեգորիա
              Category */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Կատեգորիա</InputLabel>
              <Select
                value={filters.category}
                label="Կատեգորիա"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Բոլորը</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Նվազագույն գին
              Min price */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Նվազ. գին"
              type="number"
              variant="outlined"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </Grid>

          {/* Առավելագույն գին
              Max price */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Առավել. գին"
              type="number"
              variant="outlined"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </Grid>

          {/* Գործողություններ
              Actions */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ minWidth: 'auto' }}
              >
                Մաքրել
              </Button>
              <Button
                variant="contained"
                onClick={loadProducts}
                startIcon={<Refresh />}
                sx={{ minWidth: 'auto' }}
              >
                Նորացնել
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Ակտիվ ֆիլտրների ցուցադրում
            Active filters display */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.search && (
            <Chip 
              label={`Որոնում: ${filters.search}`} 
              onDelete={() => handleFilterChange('search', '')}
              color="primary"
              variant="outlined"
            />
          )}
          {filters.category && (
            <Chip 
              label={`Կատեգորիա: ${filters.category}`} 
              onDelete={() => handleFilterChange('category', '')}
              color="primary"
              variant="outlined"
            />
          )}
          {filters.minPrice && (
            <Chip 
              label={`Նվազ. գին: ${filters.minPrice}`} 
              onDelete={() => handleFilterChange('minPrice', '')}
              color="primary"
              variant="outlined"
            />
          )}
          {filters.maxPrice && (
            <Chip 
              label={`Առավել. գին: ${filters.maxPrice}`} 
              onDelete={() => handleFilterChange('maxPrice', '')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Սխալի ցուցադրում
          Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Բեռնում
          Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      )}

      {/* Ապրանքների ցուցադրում
          Products display */}
      {!loading && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Գտնվել է {products.length} ապրանք
          </Typography>
          
          {products.length === 0 ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="200px"
            >
              <Typography variant="h6" color="text.secondary">
                Ապրանք չի գտնվել
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;