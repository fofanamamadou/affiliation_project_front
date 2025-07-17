import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const TITLES = {
  '/': "Accueil - ISPATEC",
  '/login-choice': "Connexion - ISPATEC",
  '/admin/login': "Admin - Connexion",
  '/influenceur/login': "Partenaire - Connexion",
  '/register': "Inscription - ISPATEC",
  '/affiliation': "Affiliation - ISPATEC",
  '/admin': "Admin - Tableau de bord",
  '/admin/influenceurs': "Admin - Partenaires",
  '/admin/prospects': "Admin - Prospects",
  '/admin/prospects-stats': "Admin - Stats Prospects",
  '/admin/remises': "Admin - Primes",
  '/admin/remises-stats': "Admin - Stats Primes",
  '/influenceur': "Espace Partenaire",
  '/influenceur/prospects': "Mes Prospects",
  '/influenceur/prospects-stats': "Stats Prospects",
  '/influenceur/remises': "Mes Primes",
};

export default function DynamicTitle() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let title = TITLES[path];
    if (!title) {
      if (path.startsWith('/admin/influenceurs/')) title = "Détail Partenaire";
      else if (path.startsWith('/admin/prospects/')) title = "Détail Prospect";
      else if (path.startsWith('/influenceur/prospects/')) title = "Détail Prospect";
      else title = "ISPATEC - Université Bilingue";
    }
    document.title = title;
  }, [location]);
  return null;
} 