import axios from 'axios';

// Configuration de base d'axios
const API_BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expiré ou invalide - ne pas rediriger automatiquement
          // Laisser les composants gérer la redirection
          // console.warn('Token expiré ou invalide');
          break;
        case 403:
          // Accès interdit
          // console.error('Accès interdit:', data.error || data.message);
          break;
        case 404:
          // Ressource non trouvée
          // console.error('Ressource non trouvée:', data.error || data.message);
          break;
        case 422:
          // Erreur de validation
          // console.error('Erreur de validation:', data.errors);
          break;
        case 500:
          // Erreur serveur
          // console.error('Erreur serveur:', data.error || data.message);
          break;
        default:
          // console.error('Erreur HTTP:', status, data.error || data.message);
      }
    } else if (error.request) {
      // Erreur de réseau (pas de réponse du serveur)
      // console.error('Erreur de réseau:', error.message);
    } else {
      // Erreur de configuration
      // console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 