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

  // Rediriger vers la page de sélection de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login-choice" replace />;
  }

  // Vérifier le type d'utilisateur si spécifié
  if (userType) {
    if (userType === 'admin' && (currentUserType === 'admin' || currentUserType === 'superuser')) {
      return <Outlet />;
    } else if (userType === 'influenceur' && currentUserType === 'influenceur') {
      return <Outlet />;
    } else {
      // Rediriger vers l'espace approprié selon le type d'utilisateur
      if (currentUserType === 'admin' || currentUserType === 'superuser') {
        return <Navigate to="/admin" replace />;
      } else if (currentUserType === 'influenceur') {
        return <Navigate to="/influenceur" replace />;
      } else {
        return <Navigate to="/login-choice" replace />;
      }
    }
  }

  return <Outlet />;
};

export default PrivateRoute; 