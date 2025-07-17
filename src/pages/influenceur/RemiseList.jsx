import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Tooltip,
  message,
  Modal,
  Spin
} from 'antd';
import {
  EuroOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RemiseList = () => {
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Vérification de sécurité
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        message.error('Vous devez être connecté pour accéder à cette page');
        navigate('/login-choice');
        return;
      }
      
      if (userType !== 'influenceur') {
        message.error('Accès non autorisé');
        navigate('/login-choice');
        return;
      }
      // Redirection si le compte est inactif
      if (user && userType === 'influenceur' && user.is_active === false) {
        message.error('Votre compte est inactif. Veuillez contacter un administrateur pour accéder à votre espace.');
        navigate('/login-choice');
        return;
      }
    }
  }, [isAuthenticated, userType, authLoading, user, navigate]);

  useEffect(() => {
    if (!user || authLoading || !isAuthenticated || userType !== 'influenceur') return;
    loadRemises();
  }, [user, authLoading, isAuthenticated, userType]);

  const loadRemises = async () => {
    setLoading(true);
    try {
      // Utiliser le service influenceur pour récupérer les remises de l'influenceur connecté
      const result = await remiseService.getInfluenceurRemises(user.id);
      if (result.success) {
        setRemises(result.data);
      } else {
        message.error(result.error);
        setRemises([]);
      }
    } catch (error) {
      // console.error('Erreur lors du chargement des remises:', error);
      message.error('Erreur lors du chargement des remises');
      setRemises([]);
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (statut) => {
    switch (statut) {
      case 'payee':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'refusee':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'payee':
        return 'Payée';
      case 'en_attente':
        return 'En attente';
      case 'refusee':
        return 'Refusée';
      default:
        return statut;
    }
  };

  const columns = [
    {
      title: 'Montant (F CFA)',
      dataIndex: 'montant',
      key: 'montant',
      render: (val) => <b>{val ? `${val} F CFA` : '-'}</b>,
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag color={getStatusColor(statut)}>
          {statut === 'payee' ? (
            <span><CheckCircleOutlined /> Payée</span>
          ) : statut === 'en_attente' ? (
            <span><ClockCircleOutlined /> En attente</span>
          ) : (
            <span>{getStatusText(statut)}</span>
          )}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => desc || '-',
    },
    // Suppression de la colonne justificatif
  ];

 

  if (authLoading || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="ant-spin-dot">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'influenceur') {
    return null; // Redirection gérée par useEffect
  }

  return (
    <div className="partenaire-remiselist-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3} style={{ 
            marginBottom: 0,
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 'bold'
          }}>
            Mes Primes
          </Title>
          <Button type="default" onClick={() => navigate('/influenceur/remises/statistiques')} icon={<BarChartOutlined />}>Voir les statistiques</Button>
        </div>
        {remises.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={columns.map(col => col.title === 'Remise' || col.title === 'Remises' ? { ...col, title: 'Prime' } : col)}
              dataSource={remises}
              loading={loading}
              rowKey="id"
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} primes`,
                size: 'default',
                responsive: true
              }}
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1rem)'
              }}
            />
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 'clamp(30px, 8vw, 40px)',
            color: '#8c8c8c',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)'
          }}>
            Aucune prime disponible
          </div>
        )}
      </Card>
    </div>
  );
};

export default RemiseList; 