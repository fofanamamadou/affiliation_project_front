import axiosInstance from '../utils/axiosInstance';

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
      let errorMessage = 'Impossible de récupérer les statistiques';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer la liste des influenceurs
  async getInfluenceurs(params = {}) {
    try {
      const response = await axiosInstance.get('/admin/influenceurs/', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer la liste des influenceurs';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer un influenceur par ID
  async getInfluenceur(influenceurId) {
    try {
      const response = await axiosInstance.get(`/admin/influenceurs/${influenceurId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer l\'influenceur';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Créer un influenceur
  async createInfluenceur(influenceurData) {
    try {
      const response = await axiosInstance.post('/admin/influenceurs/', influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la création de l\'influenceur';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Mettre à jour un influenceur
  async updateInfluenceur(influenceurId, influenceurData) {
    try {
      const response = await axiosInstance.put(`/admin/influenceurs/${influenceurId}/`, influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la mise à jour de l\'influenceur';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Supprimer un influenceur
  async deleteInfluenceur(influenceurId) {
    try {
      await axiosInstance.delete(`/admin/influenceurs/${influenceurId}/`);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erreur lors de la suppression de l\'influenceur';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer la liste des prospects';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer le prospect';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Erreur lors de la validation du prospect';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Erreur lors du rejet du prospect';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer les rapports';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Erreur lors de la génération du rapport';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer les paramètres';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Erreur lors de la mise à jour des paramètres';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}; 