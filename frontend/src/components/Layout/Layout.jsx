import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  ExitToApp,
  Add,
  Home
} from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Վերևի նավիգացիա
          Top Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          {/* Լոգո և վերնագիր
              Logo and title */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleHome}
            sx={{ mr: 2 }}
          >
            <ShoppingCart />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={handleHome}
          >
            Բազար Բլոտ
          </Typography>

          {/* Նավիգացիայի կոճակներ
              Navigation buttons */}
          <Button 
            color="inherit" 
            startIcon={<Home />}
            onClick={handleHome}
            sx={{ mr: 1 }}
          >
            Գլխավոր
          </Button>

          {isAuthenticated() ? (
            <>
              {/* Ապրանք ավելացնել
                  Add product */}
              <Button 
                color="inherit" 
                startIcon={<Add />}
                onClick={handleAddProduct}
                sx={{ mr: 2 }}
              >
                Ապրանք ավելացնել
              </Button>

              {/* Օգտատիրոջ մենյու
                  User menu */}
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user?.firstName?.[0] || user?.email?.[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Person sx={{ mr: 1 }} />
                  {user?.firstName} {user?.lastName}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Ելք
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              startIcon={<Person />}
              onClick={handleLogin}
            >
              Մուտք / Գրանցում
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Հիմնական բովանդակություն
          Main content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>

      {/* Ստորին մաս
          Footer */}
      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto',
          py: 3, 
          px: 2, 
          bgcolor: 'background.paper',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Բազար Բլոտ. Բոլոր իրավունքները պաշտպանված են:
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;