import axiosInstance from '../utils/axiosInstance';
import { handleApiError } from '../utils/errorHandler';

// Service influenceur
export const influenceurService = {
  // Récupérer tous les influenceurs (admin)
  async getAllInfluenceurs() {
    try {
      const response = await axiosInstance.get('/influenceurs/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer la liste des influenceurs');
    }
  },

  // Créer un influenceur (admin)
  async createInfluenceur(influenceurData) {
    try {
      const response = await axiosInstance.post('/influenceurs/', influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la création de l\'influenceur');
    }
  },

  // Récupérer un influenceur par ID
  async getInfluenceur(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer l\'influenceur');
    }
  },

  // Mettre à jour un influenceur
  async updateInfluenceur(influenceurId, influenceurData) {
    try {
      // Utiliser l'endpoint standard sans /update/
      const response = await axiosInstance.put(`/influenceurs/${influenceurId}/`, influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la mise à jour de l\'influenceur');
    }
  },

  // Supprimer un influenceur (admin)
  async deleteInfluenceur(influenceurId) {
    try {
      await axiosInstance.delete(`/influenceurs/${influenceurId}/`);
      return { success: true };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la suppression de l\'influenceur');
    }
  },

  // Récupérer le dashboard d'un influenceur
  async getInfluenceurDashboard(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/dashboard/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer le dashboard');
    }
  },

  // Récupérer les prospects d'un influenceur
  async getInfluenceurProspects(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/prospects/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer les prospects');
    }
  },

  // Récupérer les remises d'un influenceur
  async getInfluenceurRemises(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/remises/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer les remises');
    }
  }
}; 