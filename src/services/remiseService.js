import axiosInstance from '../utils/axiosInstance';

export const remiseService = {
  // Lister toutes les remises (admin/influenceur)
  async getAllRemises() {
    try {
      const response = await axiosInstance.get('/remises/');
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Impossible de récupérer la liste des remises";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      return { success: false, error: errorMessage };
    }
  },

  // Récupérer les remises d'un influenceur spécifique
  async getInfluenceurRemises(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/remises/`);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Impossible de récupérer les remises de l'influenceur";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      return { success: false, error: errorMessage };
    }
  },

  // Marquer une remise comme payée (avec justificatif)
  async payerRemise(remiseId, justificatifFile) {
    try {
      const formData = new FormData();
      if (justificatifFile) formData.append('justificatif', justificatifFile);
      const response = await axiosInstance.post(`/remises/${remiseId}/payer/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Erreur lors du paiement de la remise";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      return { success: false, error: errorMessage };
    }
  },

  // Calculer automatiquement les remises pour tous les influenceurs (admin)
  async calculerRemisesAutomatiques() {
    try {
      const response = await axiosInstance.post('/remises/calculer-automatiques/');
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Erreur lors du calcul automatique des remises";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      return { success: false, error: errorMessage };
    }
  },

  // Statistiques sur les remises (admin)
  async getStatistiquesRemises() {
    try {
      const response = await axiosInstance.get('/remises/statistiques/');
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Impossible de récupérer les statistiques des remises";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      return { success: false, error: errorMessage };
    }
  },

  // Statistiques sur les remises d'un influenceur (influenceur ou admin)
  async getStatistiquesRemisesInfluenceur(influenceurId) {
    try {
      const response = await axiosInstance.get(`/influenceurs/${influenceurId}/statistiques-remises/`);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Impossible de récupérer les statistiques des remises de l'influenceur";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      return { success: false, error: errorMessage };
    }
  },

  // Supprimer une remise (admin)
  async deleteRemise(remiseId) {
    try {
      await axiosInstance.delete(`/remises/${remiseId}/delete/`);
      return { success: true };
    } catch (error) {
      let errorMessage = "Erreur lors de la suppression de la prime";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      return { success: false, error: errorMessage };
    }
  }
}; 