import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Button, message } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  ShareAltOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { influenceurService } from '../../services/influenceurService';
import { useNavigate } from 'react-router-dom';

const InfluenceurDashboard = () => {
  const { user, isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProspects: 0,
    totalRemises: 0,
    totalGains: 0,
    tauxConversion: 0
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentProspects, setRecentProspects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fonction utilitaire pour la couleur du camembert
  const getPieColor = (statut) => {
    switch (statut) {
      case 'payee':
      case 'valide':
        return '#52c41a';
      case 'en_attente':
        return '#faad14';
      case 'refuse':
      case 'refusee':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  useEffect(() => {
    if (!user || authLoading || !isAuthenticated || userType !== 'influenceur') return;
    
    setLoading(true);
    influenceurService.getInfluenceurDashboard(user.id).then(result => {
      if (result.success) {
        const data = result.data;
        setStats({
          totalProspects: data.total_prospects || 0,
          totalRemises: data.total_remises || 0,
          totalGains: data.total_gains || 0,
          tauxConversion: data.taux_conversion || 0
        });
        setChartData(
          (data.evolution || []).map(item => ({
            name: item.mois,
            prospects: item.prospects,
            remises: item.remises
          }))
        );
        setPieData(
          (data.repartition_remises || []).map(item => ({
            name: item.statut,
            value: item.count,
            color: getPieColor(item.statut)
          }))
        );
        setRecentProspects(data.prospects_recents || []);
      } else {
        console.error('Erreur lors du chargement du dashboard:', result.error);
        message.error('Erreur lors du chargement des données');
        setStats({ totalProspects: 0, totalRemises: 0, totalGains: 0, tauxConversion: 0 });
        setChartData([]);
        setPieData([]);
        setRecentProspects([]);
      }
      setLoading(false);
    }).catch(error => {
      console.error('Erreur lors du chargement du dashboard:', error);
      message.error('Erreur lors du chargement des données');
      setLoading(false);
    });
  }, [user, authLoading, isAuthenticated, userType]);

  const statsCards = [
    {
      title: 'Prospects',
      value: stats.totalProspects,
      icon: <TeamOutlined />,
      color: '#1890ff',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Remises',
      value: stats.totalRemises,
      icon: <DollarOutlined />,
      color: '#52c41a',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Gains Totaux',
      value: `${stats.totalGains.toLocaleString()} F CFA`,
      icon: <BarChartOutlined />,
      color: '#722ed1',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Taux de Conversion',
      value: `${stats.tauxConversion}%`,
      icon: <TrophyOutlined />,
      color: '#faad14',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirme':
      case 'valide':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'rejete':
      case 'refuse':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirme':
      case 'valide':
        return 'Validé';
      case 'en_attente':
        return 'En attente';
      case 'rejete':
      case 'refuse':
        return 'Refusé';
      default:
        return status;
    }
  };

  const handleShareLink = () => {
    if (user && user.code_affiliation) {
      const link = `${window.location.origin}/affiliation/${user.code_affiliation}`;
      navigator.clipboard.writeText(link).then(() => {
        message.success('Lien copié dans le presse-papiers !');
      }).catch(() => {
        message.error('Erreur lors de la copie du lien');
      });
    } else {
      message.error('Code d\'affiliation non disponible');
    }
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
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Dashboard Influenceur</h1>
        <p style={{ color: '#8c8c8c', margin: '8px 0 0 0' }}>Suivez vos performances et vos gains</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
              />
              <div style={{ marginTop: '8px' }}>
                <Tag color={card.changeType === 'positive' ? 'green' : 'red'}>
                  {card.change} vs mois dernier
                </Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Évolution des prospects et remises">
            <div style={{ height: '300px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="prospects" stroke="#1890ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="remises" stroke="#52c41a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#8c8c8c'
                }}>
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Répartition des remises">
            <div style={{ height: '300px' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#8c8c8c'
                }}>
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Prospects */}
      <Card 
        title="Prospects récents" 
        extra={
          <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShareLink}>
            Partager mon lien
          </Button>
        }
      >
        {recentProspects.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={recentProspects}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.nom}
                  description={item.email}
                />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {item.montant || 0} F CFA
                  </div>
                  <Tag color={getStatusColor(item.statut)}>
                    {getStatusText(item.statut)}
                  </Tag>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                    {item.date_creation ? new Date(item.date_creation).toLocaleDateString('fr-FR') : '-'}
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#8c8c8c'
          }}>
            Aucun prospect récent
          </div>
        )}
      </Card>
    </div>
  );
};

export default InfluenceurDashboard; 