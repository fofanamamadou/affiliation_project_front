import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { authService } from '../services/authService';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Vérification initiale de l'authentification
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Vérifier le statut d'authentification
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Vérifier si un token existe
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Vérifier la validité du token en récupérant le profil
      const result = await authService.getProfile();
      
      if (result.success) {
        const userData = result.data;
        if (userData.user_type === 'superuser') {
          setUserType('superuser');
          setPermissions({
            is_admin: true,
            is_moderateur: false,
            peut_creer_influenceurs: true,
            peut_valider_prospects: true,
            peut_payer_remises: true,
            peut_voir_statistiques: true,
            peut_gerer_systeme: true
          });
          setUser(userData.user);
        } else {
          setUserType(userData.user_type);
          setPermissions(userData.permissions || []);
          setUser(userData.influenceur);
        }
        setIsAuthenticated(true);
      } else {
        // Token invalide, nettoyer le localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        localStorage.removeItem('permissions');
      }
    } catch (error) {
      // console.error('Erreur lors de la vérification du statut:', error);
    } finally {
      setLoading(false);
    }
  };

  // Connexion générique (pour compatibilité)
  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        if (result.user_type === 'superuser') {
          setUser(result.user);
          setUserType('superuser');
          setPermissions({
            is_admin: true,
            is_moderateur: false,
            peut_creer_influenceurs: true,
            peut_valider_prospects: true,
            peut_payer_remises: true,
            peut_voir_statistiques: true,
            peut_gerer_systeme: true
          });
        } else {
          setUser(result.user);
          setUserType(result.user_type);
          setPermissions(result.permissions || []);
        }
        setIsAuthenticated(true);
        message.success('Connexion réussie !');
        return { success: true };
      } else {
        message.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      // console.error('Erreur de connexion:', error);
      message.error('Erreur lors de la connexion');
      return { success: false, error: 'Erreur lors de la connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Connexion administrateur
  const adminLogin = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.adminLogin(credentials);
      
      if (result.success) {
        if (result.user_type === 'superuser') {
          setUser(result.user);
          setUserType('superuser');
          setPermissions({
            is_admin: true,
            is_moderateur: false,
            peut_creer_influenceurs: true,
            peut_valider_prospects: true,
            peut_payer_remises: true,
            peut_voir_statistiques: true,
            peut_gerer_systeme: true
          });
        } else {
          setUser(result.user);
          setUserType(result.user_type);
          setPermissions(result.permissions || []);
        }
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      // console.error('Erreur de connexion administrateur:', error);
      return { success: false, error: 'Erreur lors de la connexion administrateur' };
    } finally {
      setLoading(false);
    }
  };

  // Connexion influenceur
  const influenceurLogin = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.influenceurLogin(credentials);
      
      if (result.success) {
        if (result.user_type === 'superuser') {
          setUser(result.user);
          setUserType('superuser');
          setPermissions({
            is_admin: true,
            is_moderateur: false,
            peut_creer_influenceurs: true,
            peut_valider_prospects: true,
            peut_payer_remises: true,
            peut_voir_statistiques: true,
            peut_gerer_systeme: true
          });
        } else {
          setUser(result.user);
          setUserType(result.user_type);
          setPermissions(result.permissions || []);
        }
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      // console.error('Erreur de connexion influenceur:', error);
      return { success: false, error: 'Erreur lors de la connexion influenceur' };
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        // Ne pas connecter automatiquement l'utilisateur après inscription
        message.success('Inscription réussie !');
        return { success: true };
      } else {
        message.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      // console.error('Erreur lors de l\'inscription:', error);
      message.error('Erreur lors de l\'inscription');
      return { success: false, error: 'Erreur lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setUserType(null);
      setPermissions([]);
      setIsAuthenticated(false);
      message.success('Déconnexion réussie');
    }
  };

  // Changement de mot de passe
  const changePassword = async (passwords) => {
    try {
      setLoading(true);
      const result = await authService.changePassword(passwords);
      
      if (result.success) {
        message.success('Mot de passe modifié avec succès');
        return { success: true };
      } else {
        message.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      // console.error('Erreur lors du changement de mot de passe:', error);
      message.error('Erreur lors du changement de mot de passe');
      return { success: false, error: 'Erreur lors du changement de mot de passe' };
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur a un type spécifique
  const hasUserType = (type) => {
    return userType === type;
  };

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return userType === 'admin' || userType === 'superuser';
  };

  // Vérifier si l'utilisateur est influenceur
  const isInfluenceur = () => {
    return userType === 'influenceur';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    userType,
    permissions,
    login,
    adminLogin,
    influenceurLogin,
    register,
    logout,
    changePassword,
    hasUserType,
    hasPermission,
    isAdmin,
    isInfluenceur,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 