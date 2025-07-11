import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

const PrivateRoute = ({ userType }) => {
  const { user, loading, isAuthenticated, userType: currentUserType } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le type d'utilisateur si spécifié
  if (userType && currentUserType !== userType) {
    if (currentUserType === 'superuser') {
      return <Navigate to="/admin" replace />;
    } else if (currentUserType === 'influenceur') {
      return <Navigate to="/influenceur" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute; 