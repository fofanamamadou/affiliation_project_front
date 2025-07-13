import axiosInstance from '../utils/axiosInstance';
import { handleApiError } from '../utils/errorHandler';

// Service d'administration
export const adminService = {
  // Récupérer les statistiques du dashboard admin
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get('/dashboard-global/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer les statistiques');
    }
  },

  // Récupérer la liste des influenceurs
  async getInfluenceurs(params = {}) {
    try {
      const response = await axiosInstance.get('/influenceurs/', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer la liste des influenceurs');
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

  // Créer un influenceur
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

  // Mettre à jour un influenceur
  async updateInfluenceur(influenceurId, influenceurData) {
    try {
      const response = await axiosInstance.put(`/influenceurs/${influenceurId}/`, influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la mise à jour de l\'influenceur');
    }
  },

  // Supprimer un influenceur
  async deleteInfluenceur(influenceurId) {
    try {
      await axiosInstance.delete(`/influenceurs/${influenceurId}/`);
      return { success: true };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la suppression de l\'influenceur');
    }
  },

  // Récupérer la liste des prospects
  async getProspects(params = {}) {
    try {
      const response = await axiosInstance.get('/admin/prospects/', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer la liste des prospects');
    }
  },

  // Récupérer un prospect par ID
  async getProspect(prospectId) {
    try {
      const response = await axiosInstance.get(`/admin/prospects/${prospectId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer le prospect');
    }
  },

  // Valider un prospect
  async validateProspect(prospectId, validationData) {
    try {
      const response = await axiosInstance.put(`/admin/prospects/${prospectId}/validate/`, validationData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la validation du prospect');
    }
  },

  // Rejeter un prospect
  async rejectProspect(prospectId, rejectionData) {
    try {
      const response = await axiosInstance.put(`/admin/prospects/${prospectId}/reject/`, rejectionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors du rejet du prospect');
    }
  },

  // Récupérer les rapports
  async getReports(params = {}) {
    try {
      const response = await axiosInstance.get('/admin/reports/', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer les rapports');
    }
  },

  // Générer un rapport
  async generateReport(reportData) {
    try {
      const response = await axiosInstance.post('/admin/reports/generate/', reportData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la génération du rapport');
    }
  },

  // Récupérer les paramètres système
  async getSystemSettings() {
    try {
      const response = await axiosInstance.get('/admin/settings/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Impossible de récupérer les paramètres système');
    }
  },

  // Mettre à jour les paramètres système
  async updateSystemSettings(settings) {
    try {
      const response = await axiosInstance.put('/admin/settings/', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la mise à jour des paramètres');
    }
  }
}; 