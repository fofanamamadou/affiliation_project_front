import axiosInstance from '../utils/axiosInstance';

// Service d'affiliation
export const affiliationService = {
  // Récupérer les informations d'un influenceur
  async getInfluenceurInfo(influenceurId) {
    try {
      const response = await axiosInstance.get(`/affiliation/influenceur/${influenceurId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les informations de l\'influenceur';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Influenceur non trouvé';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Créer une inscription via affiliation
  async createInscription(inscriptionData) {
    try {
      const response = await axiosInstance.post('/affiliation/inscription/', inscriptionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Gestion des erreurs de validation
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

  // Upload de documents
  async uploadDocuments(files, inscriptionId) {
    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
      });
      
      if (inscriptionId) {
        formData.append('inscription_id', inscriptionId);
      }

      const response = await axiosInstance.post('/affiliation/upload-documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors du téléchargement des documents';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Vérifier le statut d'une inscription
  async checkInscriptionStatus(inscriptionId) {
    try {
      const response = await axiosInstance.get(`/affiliation/inscription/${inscriptionId}/status/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de vérifier le statut';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Récupérer les statistiques d'affiliation
  async getAffiliationStats(influenceurId) {
    try {
      const response = await axiosInstance.get(`/affiliation/stats/${influenceurId}/`);
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

  // Récupérer la liste des inscriptions d'un influenceur
  async getInfluenceurInscriptions(influenceurId, params = {}) {
    try {
      const response = await axiosInstance.get(`/affiliation/influenceur/${influenceurId}/inscriptions/`, {
        params
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les inscriptions';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Valider une inscription (admin)
  async validateInscription(inscriptionId, validationData) {
    try {
      const response = await axiosInstance.put(`/affiliation/inscription/${inscriptionId}/validate/`, validationData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la validation';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Rejeter une inscription (admin)
  async rejectInscription(inscriptionId, rejectionData) {
    try {
      const response = await axiosInstance.put(`/affiliation/inscription/${inscriptionId}/reject/`, rejectionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      let errorMessage = 'Erreur lors du rejet';
      
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