import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import {
  Edit,
  Delete,
  ShoppingCart
} from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Օգտատիրը կարող է խմբագրել սեփական ապրանքները
  // User can edit their own products
  const canEdit = isAuthenticated() && 
    (user?.id === product.userId || user?.role === 'Admin');

  // Գնի ֆորմատավորում
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Ամսաթվի ֆորմատավորում
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {/* Ապրանքի պատկեր
          Product image */}
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || '/api/placeholder/300/200'}
        alt={product.name}
        sx={{ 
          objectFit: 'cover',
          backgroundColor: '#f5f5f5'
        }}
        onError={(e) => {
          e.target.src = '/api/placeholder/300/200';
        }}
      />

      {/* Ապրանքի բովանդակություն
          Product content */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Անվանում
            Name */}
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </Typography>

        {/* Նկարագրություն
            Description */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.description}
        </Typography>

        {/* Գին
            Price */}
        <Typography 
          variant="h5" 
          color="primary" 
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {formatPrice(product.price)}
        </Typography>

        {/* Կատեգորիա և քանակ
            Category and stock */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {product.category && (
            <Chip 
              label={product.category} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
          <Typography variant="body2" color="text.secondary">
            Պահեստ: {product.stockQuantity}
          </Typography>
        </Box>

        {/* Ամսաթիվ
            Date */}
        <Typography variant="caption" color="text.secondary">
          {formatDate(product.createdAt)}
        </Typography>
      </CardContent>

      {/* Գործողություններ
          Actions */}
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button 
          size="small" 
          variant="contained" 
          startIcon={<ShoppingCart />}
          disabled={product.stockQuantity === 0}
        >
          {product.stockQuantity === 0 ? 'Չկա պահեստում' : 'Գնել'}
        </Button>

        {canEdit && (
          <Box>
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => onEdit(product)}
              aria-label="Խմբագրել"
            >
              <Edit />
            </IconButton>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onDelete(product)}
              aria-label="Ջնջել"
            >
              <Delete />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;