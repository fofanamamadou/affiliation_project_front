import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Button, message, Typography } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  ShareAltOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { influenceurService } from '../../services/influenceurService';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const InfluenceurDashboard = () => {
  const { user, isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProspects: 0,
    totalRemises: 0,
    totalGains: 0,
    gainsEnAttente: 0,
    remisesEnAttente: 0,
    remisesPayees: 0,
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
          gainsEnAttente: data.gains_en_attente || 0,
          remisesEnAttente: data.remises_en_attente || 0,
          remisesPayees: data.remises_payees || 0,
          tauxConversion: data.taux_conversion || 0,
          prospectsConfirmes: data.nb_prospects_confirmes || 0,
          prospectsRejetes: data.nb_prospects_rejetes || 0,
          prospectsEnAttente: data.nb_prospects_en_attente || 0,
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
        // console.error('Erreur lors du chargement du dashboard:', result.error);
        message.error('Erreur lors du chargement des données');
        setStats({ totalProspects: 0, totalRemises: 0, totalGains: 0, tauxConversion: 0 });
        setChartData([]);
        setPieData([]);
        setRecentProspects([]);
      }
      setLoading(false);
    }).catch(error => {
      // console.error('Erreur lors du chargement du dashboard:', error);
      message.error('Erreur lors du chargement des données');
      setLoading(false);
    });
  }, [user, authLoading, isAuthenticated, userType]);

  const statsCards = [
    {
      title: 'Total prospects',
      value: stats.totalProspects,
      icon: <TeamOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Prospects inscrit',
      value: stats.prospectsConfirmes || 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Prospects rejetés',
      value: stats.prospectsRejetes || 0,
      icon: <CloseCircleOutlined />,
      color: '#ff4d4f',
    },
    {
      title: 'Prospects en attente',
      value: stats.prospectsEnAttente || 0,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: 'Total primes',
      value: stats.totalRemises,
      icon: <BarChartOutlined />,
      color: '#722ed1',
    },
    {
      title: 'Primes payées',
      value: stats.remisesPayees || 0,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Primes en attente',
      value: stats.remisesEnAttente || 0,
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'Gains payés',
      value: `${stats.totalGains.toLocaleString()} F CFA`,
      icon: <DollarOutlined />,
      color: '#13c2c2',
    },
    {
      title: 'Gains en attente',
      value: stats.gainsEnAttente !== undefined ? `${Number(stats.gainsEnAttente).toLocaleString()} F CFA` : '0 F CFA',
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: 'Taux de conversion',
      value: `${stats.tauxConversion}%`,
      icon: <TrophyOutlined />,
      color: '#faad14',
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'inscrit':
      case 'valide':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'rejeter':
      case 'refuse':
      case 'rejete':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'inscrit':
      case 'valide':
        return 'Inscrit';
      case 'en_attente':
        return 'En attente';
      case 'rejeter':
      case 'refuse':
      case 'rejete':
        return 'Rejeté';
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
    <div className="partenaire-dashboard-responsive" style={{ padding: '4vw 2vw', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', margin: 0 }}>Dashboard Partenaire</h1>
        <p className="mobile-hide" style={{ color: '#8c8c8c', margin: '8px 0 0 0', fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>Suivez vos performances et vos gains</p>
      </div>
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card style={{ height: '100%' }}>
              <Statistic
                title={<span style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>{card.title}</span>}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={<span style={{ fontSize: 'clamp(1.05rem, 2vw, 1.15rem)' }}>Évolution des prospects et primes</span>}>
            <div style={{ height: '300px', width: '100%' }}>
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
          <Card title={<span style={{ fontSize: 'clamp(1.05rem, 2vw, 1.15rem)' }}>Répartition des primes</span>}>
            <div style={{ height: '300px', width: '100%' }}>
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
      <Card style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, fontSize: 'clamp(1.1rem, 2vw, 1.3rem)' }}>Prospects récents</Title>
          <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShareLink} style={{ minWidth: 180, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>
            Partager mon lien
          </Button>
        </div>
        <div style={{ width: '100%' }}>
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
                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>
                      {item.montant_individuel !== undefined ? item.montant_individuel : 0} F CFA
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Statut prospect :</span>
                      <Tag color={getStatusColor(item.statut)}>
                        {getStatusText(item.statut)}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 4 }}>
                      {item.date_creation ? new Date(item.date_creation).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
              Aucun prospect récent
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InfluenceurDashboard; 