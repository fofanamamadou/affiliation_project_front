// Utilitaire pour gérer les erreurs de manière centralisée
export const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  // console.error('API Error:', error);
  
  // Erreur de réseau (pas de connexion au serveur)
  if (!error.response) {
    return {
      success: false,
      error: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
    };
  }
  
  // Erreur de timeout
  if (error.code === 'ECONNABORTED') {
    return {
      success: false,
      error: 'Délai d\'attente dépassé. Vérifiez votre connexion.'
    };
  }
  
  const { status, data } = error.response;
  
  // Gestion des erreurs HTTP spécifiques
  switch (status) {
    case 400:
      return {
        success: false,
        error: data.error || data.message || 'Données invalides'
      };
    case 401:
      return {
        success: false,
        error: data.error || data.message || 'Identifiants incorrects'
      };
    case 403:
      return {
        success: false,
        error: data.error || data.message || 'Accès interdit'
      };
    case 404:
      return {
        success: false,
        error: data.error || data.message || 'Ressource non trouvée'
      };
    case 422:
      // Erreur de validation
      if (data.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat();
        return {
          success: false,
          error: errorMessages.join(', ')
        };
      }
      return {
        success: false,
        error: data.error || data.message || 'Données invalides'
      };
    case 500:
      return {
        success: false,
        error: 'Erreur serveur. Veuillez réessayer plus tard.'
      };
    default:
      return {
        success: false,
        error: data.error || data.message || defaultMessage
      };
  }
};

// Fonction pour nettoyer les tokens en cas d'erreur d'authentification
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_type');
  localStorage.removeItem('permissions');
};

// Fonction pour vérifier si une erreur nécessite une déconnexion
export const shouldLogout = (error) => {
  if (!error.response) return false;
  
  const { status } = error.response;
  return status === 401 || status === 403;
}; 