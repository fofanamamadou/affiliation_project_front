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
  },

  // Valider un influenceur (admin)
  async validateInfluenceur(influenceurId) {
    try {
      const response = await axiosInstance.patch(`/influenceurs/${influenceurId}/valider/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, "Erreur lors de la validation de l'influenceur");
    }
  },

  // Désactiver un influenceur (admin)
  async deactivateInfluenceur(influenceurId) {
    try {
      const response = await axiosInstance.patch(`/influenceurs/${influenceurId}/desactiver/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, "Erreur lors de la désactivation de l'influenceur");
    }
  },

  // Définir la prime d'un influenceur (admin)
  async definirPrimeInfluenceur(influenceurId, montant) {
    try {
      const response = await axiosInstance.patch(`/influenceurs/${influenceurId}/definir-prime/`, { prime_par_prospect_cfa: montant });
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error, "Erreur lors de la modification de la prime de l'influenceur");
    }
  },

  // Mettre à jour le profil d'un influenceur (par l'influenceur lui-même)
  async updateInfluenceurProfile(influenceurId, profileData) {
    try {
      const response = await axiosInstance.patch(`/influenceurs/${influenceurId}/`, profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la mise à jour du profil');
    }
  },

  // Changer le mot de passe de l'utilisateur connecté
  async changePassword(passwordData) {
    try {
      const response = await axiosInstance.post('/auth/change-password/', passwordData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors du changement de mot de passe');
    }
  },

  // Envoyer un mot de passe temporaire
  async forgotPasswordTemp(email) {
    try {
      const response = await axiosInstance.post('/influenceurs/forgot-password-temp/', { email });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Erreur lors de la demande de mot de passe');
    }
  }
}; 