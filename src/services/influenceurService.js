import axiosInstance from '../utils/axiosInstance';

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
      let errorMessage = 'Impossible de récupérer la liste des influenceurs';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Erreur lors de la création de l\'influenceur';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
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
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer l\'influenceur';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
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
      const response = await axiosInstance.put(`/influenceurs/${influenceurId}/update/`, influenceurData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la mise à jour de l\'influenceur';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Supprimer un influenceur (admin)
  async deleteInfluenceur(influenceurId) {
    try {
      await axiosInstance.delete(`/influenceurs/${influenceurId}/delete/`);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erreur lors de la suppression de l\'influenceur';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer le dashboard';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer les prospects';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
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
      let errorMessage = 'Impossible de récupérer les remises';
      
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