import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Մուտք, 1 = Գրանցում
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Մուտքի ֆորմի դաշտեր
  // Login form fields
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Գրանցման ֆորմի դաշտեր
  // Registration form fields
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginForm);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Գաղտնաբառի համընկնության ստուգում
    // Check password confirmation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Գաղտնաբառերը չեն համընկնում');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword: _, ...userData } = registerForm;
      await register(userData);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%',
          borderRadius: 2
        }}
      >
        {/* Վերնագիր
            Title */}
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Բազար Բլոտ
        </Typography>

        {/* Ներդիրներ (Մուտք/Գրանցում)
            Tabs (Login/Register) */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Մուտք" />
          <Tab label="Գրանցում" />
        </Tabs>

        {/* Սխալի ցուցադրում
            Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Մուտքի ֆորմ
            Login form */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Էլ. փոստ"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Գաղտնաբառ"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Մուտք'}
            </Button>
          </Box>
        )}

        {/* Գրանցման ֆորմ
            Registration form */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <TextField
              fullWidth
              label="Անուն"
              variant="outlined"
              margin="normal"
              required
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Ազգանուն"
              variant="outlined"
              margin="normal"
              required
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Էլ. փոստ"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Գաղտնաբառ"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Հաստատել գաղտնաբառը"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Գրանցվել'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AuthForm;