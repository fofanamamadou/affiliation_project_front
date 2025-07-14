import axiosInstance from '../utils/axiosInstance';

// Service prospect
export const prospectService = {
  // Récupérer tous les prospects
  async getAllProspects() {
    try {
      const response = await axiosInstance.get('/prospects/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer la liste des prospects';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer les prospects d'un influenceur spécifique
  async getInfluenceurProspects(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/prospects/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les prospects de l\'influenceur';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer un prospect par ID
  async getProspectById(prospectId) {
    try {
      const response = await axiosInstance.get(`/prospects/${prospectId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les détails du prospect';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Créer un prospect
  async createProspect(prospectData) {
    try {
      const response = await axiosInstance.post('/prospects/', prospectData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la création du prospect';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Valider un prospect
  async validateProspect(prospectId) {
    try {
      const response = await axiosInstance.post(`/prospects/${prospectId}/valider/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la validation du prospect';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Rejeter un prospect
  async rejectProspect(prospectId) {
    try {
      const response = await axiosInstance.post(`/prospects/${prospectId}/rejeter/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors du rejet du prospect';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer les statistiques des prospects
  async getProspectsStats() {
    try {
      const response = await axiosInstance.get('/prospects/statistiques/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les statistiques des prospects';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer les prospects sans remise
  async getProspectsSansRemise() {
    try {
      const response = await axiosInstance.get('/prospects/sans-remise/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les prospects sans remise';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Créer un prospect via formulaire d'affiliation (public)
  async createProspectViaAffiliation(codeAffiliation, prospectData) {
    try {
      const response = await axiosInstance.post(`/affiliation/${codeAffiliation}/`, prospectData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
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