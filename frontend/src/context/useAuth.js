import { useContext } from 'react';
import { AuthContext } from './context';

// AuthContext Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth պետք է օգտագործվի AuthProvider-ի ներսում');
  }
  return context;
};