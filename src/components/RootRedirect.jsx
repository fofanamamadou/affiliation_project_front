import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RootRedirect = () => {
  const { isAuthenticated, userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // attendre la vérification du contexte
    if (isAuthenticated) {
      if (userType === 'admin' || userType === 'superuser') {
        navigate('/admin', { replace: true });
      } else if (userType === 'influenceur') {
        navigate('/influenceur', { replace: true });
      } else {
        navigate('/login-choice', { replace: true });
      }
    } else {
      navigate('/login-choice', { replace: true });
    }
  }, [isAuthenticated, userType, loading, navigate]);

  return null; // ou un loader si tu veux
};

export default RootRedirect; 