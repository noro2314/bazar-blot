import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Save,
  Cancel,
  CloudUpload
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../api/products';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Ապրանքի ֆորմի դաշտեր
  // Product form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: ''
  });

  // Կատեգորիաների բեռնում
  // Load categories
  const loadCategories = async () => {
    try {
      const data = await productsAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Կատեգորիաների բեռնման սխալ:', err);
    }
  };

  // Ապրանքի տվյալների բեռնում (խմբագրման դեպքում)
  // Load product data (for editing)
  const loadProduct = async () => {
    if (!isEdit) return;
    
    try {
      setLoading(true);
      const product = await productsAPI.getProduct(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        category: product.category || '',
        imageUrl: product.imageUrl || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Տվյալների վալիդացիա
    // Data validation
    if (!formData.name.trim()) {
      setError('Անվանումը պարտադիր է');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Գինը պետք է լինի դրական թիվ');
      setLoading(false);
      return;
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      setError('Քանակը պետք է լինի 0-ից մեծ կամ հավասար');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      };

      if (isEdit) {
        await productsAPI.updateProduct(id, { ...productData, id: parseInt(id) });
      } else {
        await productsAPI.createProduct(productData);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Վերնագիր
            Title */}
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          {isEdit ? 'Խմբագրել ապրանքը' : 'Նոր ապրանք ավելացնել'}
        </Typography>

        {/* Սխալի ցուցադրում
            Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Ֆորմ
            Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Անվանում
              Name */}
          <TextField
            fullWidth
            label="Ապրանքի անվանումը *"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          {/* Նկարագրություն
              Description */}
          <TextField
            fullWidth
            label="Նկարագրություն"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Ապրանքի մանրամասն նկարագրություն..."
          />

          {/* Գին և քանակ
              Price and quantity */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Գինը *"
              type="number"
              variant="outlined"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">դրամ</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Քանակը պահեստում *"
              type="number"
              variant="outlined"
              value={formData.stockQuantity}
              onChange={(e) => handleChange('stockQuantity', e.target.value)}
              required
              InputProps={{
                inputProps: { min: 0, step: 1 }
              }}
              sx={{ flex: 1 }}
            />
          </Box>

          {/* Կատեգորիա
              Category */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Կատեգորիա</InputLabel>
            <Select
              value={formData.category}
              label="Կատեգորիա"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <MenuItem value="">
                <em>Ընտրել կատեգորիա</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
              {/* Նոր կատեգորիա ավելացնելու հնարավորություն
                  Option to add new category */}
              <MenuItem value="other">
                <em>Այլ (նշել ստորև)</em>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Նոր կատեգորիա (եթե ընտրված է "Այլ")
              New category (if "Other" is selected) */}
          {formData.category === 'other' && (
            <TextField
              fullWidth
              label="Նշել նոր կատեգորիա"
              variant="outlined"
              margin="normal"
              value={formData.customCategory || ''}
              onChange={(e) => handleChange('customCategory', e.target.value)}
              placeholder="Օրինակ: Էլեկտրոնիկա, Հագուստ, Գրքեր..."
            />
          )}

          {/* Պատկերի URL
              Image URL */}
          <TextField
            fullWidth
            label="Պատկերի հղում (URL)"
            variant="outlined"
            margin="normal"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CloudUpload />
                </InputAdornment>
              )
            }}
          />

          {/* Պատկերի նախադիտում
              Image preview */}
          {formData.imageUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Պատկերի նախադիտում:
              </Typography>
              <img
                src={formData.imageUrl}
                alt="Նախադիտում"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}

          {/* Գործողությունների կոճակներ
              Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<Cancel />}
              disabled={loading}
            >
              Չեղարկել
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? 'Պահպանում...' : (isEdit ? 'Պահպանել' : 'Ավելացնել')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductForm;