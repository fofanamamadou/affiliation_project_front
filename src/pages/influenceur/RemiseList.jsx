import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Tooltip,
  message
} from 'antd';
import {
  EuroOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined
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
    }
  }, [isAuthenticated, userType, authLoading, navigate]);

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
      console.error('Erreur lors du chargement des remises:', error);
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
    {
      title: 'Justificatif',
      dataIndex: 'justificatif',
      key: 'justificatif',
      render: (justificatif) => justificatif ? (
        <Tooltip title="Télécharger le justificatif">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            href={justificatif}
            target="_blank"
            rel="noopener noreferrer"
          >
            Télécharger
          </Button>
        </Tooltip>
      ) : (
        <Tag color="default">Non disponible</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir les détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    // TODO: Créer une page de détails pour les remises (influenceur)
    message.info('Page de détails de la remise à implémenter');
  };

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
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>Mes Primes</Title>
        {remises.length > 0 ? (
          <Table
            columns={columns}
            dataSource={remises}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} primes`,
            }}
          />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#8c8c8c'
          }}>
            Aucune prime disponible
          </div>
        )}
      </Card>
    </div>
  );
};

export default RemiseList; 