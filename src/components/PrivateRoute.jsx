import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

const PrivateRoute = ({ adminOnly, superadminOnly, influenceurOnly }) => {
  const { loading, isAuthenticated, isStaff, isSuperuser, userType } = useAuth();

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

  // Accès réservé superadmin
  if (superadminOnly && !isSuperuser) {
    if (isStaff) {
      return <Navigate to="/admin" replace />;
    } else if (userType === 'influenceur') {
      return <Navigate to="/influenceur" replace />;
    } else {
      return <Navigate to="/login-choice" replace />;
    }
  }

  // Accès réservé admin (is_staff)
  if (adminOnly && !isStaff) {
    if (userType === 'influenceur') {
      return <Navigate to="/influenceur" replace />;
    } else {
      return <Navigate to="/login-choice" replace />;
    }
  }

  // Accès réservé influenceur
  if (influenceurOnly && userType !== 'influenceur') {
    if (isStaff) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/login-choice" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute; 