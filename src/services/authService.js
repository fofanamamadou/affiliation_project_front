import axiosInstance from '../utils/axiosInstance';

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login/', credentials);
      const { access_token, refresh_token, user_type, user, influenceur, permissions } = response.data;
      
      // Stockage des données
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('permissions', JSON.stringify(permissions));
      
      // Stocker les données utilisateur selon le type
      if (user_type === 'superuser') {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', JSON.stringify(influenceur));
      }
      
      return {
        success: true,
        user: user_type === 'superuser' ? user : influenceur,
        user_type,
        permissions,
        access_token,
        refresh_token
      };
    } catch (error) {
      let errorMessage = 'Erreur de connexion';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Délai d\'attente dépassé. Vérifiez votre connexion.';
      } else if (!error.response) {
        errorMessage = 'Impossible de se connecter au serveur.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Déconnexion
  async logout() {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        await axiosInstance.post('/auth/logout/', { refresh_token });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyage local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      localStorage.removeItem('permissions');
    }
  },

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        return { success: false, error: 'Aucun refresh token trouvé' };
      }

      const response = await axiosInstance.post('/auth/refresh/', { refresh_token });
      const { access_token, refresh_token: new_refresh_token } = response.data;
      
      // Mettre à jour les tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', new_refresh_token);
      
      return { success: true };
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      localStorage.removeItem('permissions');
      return { success: false, error: 'Token invalide' };
    }
  },

  // Récupération du profil utilisateur
  async getProfile() {
    try {
      const response = await axiosInstance.get('/auth/profile/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Impossible de récupérer le profil'
      };
    }
  },

  // Inscription
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register/', userData);
      const { access_token, refresh_token, influenceur, permissions } = response.data;
      
      // Stockage des données
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_type', 'influenceur');
      localStorage.setItem('user', JSON.stringify(influenceur));
      localStorage.setItem('permissions', JSON.stringify(permissions));
      
      return {
        success: true,
        user: influenceur,
        user_type: 'influenceur',
        permissions,
        access_token,
        refresh_token
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Changement de mot de passe
  async changePassword(passwords) {
    try {
      await axiosInstance.post('/auth/change-password/', passwords);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erreur lors du changement de mot de passe';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}; 