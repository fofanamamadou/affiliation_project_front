import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, message, Spin, Button, Progress } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  TrophyOutlined, 
  DownloadOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import { prospectService } from '../../services/prospectService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [prospectStats, setProspectStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Récupérer les stats générales
      const result = await adminService.getDashboardStats();
      if (result.success) {
        setStats(result.data);
      } else {
        message.error(result.error || 'Erreur lors du chargement des statistiques');
      }

      // Récupérer les stats des prospects
      const prospectResult = await prospectService.getProspectsStats();
      if (prospectResult.success) {
        setProspectStats(prospectResult.data);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><Spin size="large" /></div>;
  }

  const statCards = [
    {
      title: 'Influenceurs',
      value: stats.total_influenceurs || 0,
      icon: <UserOutlined />, 
      color: '#1890ff'
    },
    {
      title: 'Prospects Total',
      value: stats.total_prospects || 0,
      icon: <TeamOutlined />, 
      color: '#722ed1'
    },
    {
      title: 'Prospects En Attente',
      value: stats.prospects_en_attente || 0,
      icon: <ClockCircleOutlined />, 
      color: '#faad14'
    },
    {
      title: 'Prospects Confirmés',
      value: stats.prospects_confirmes || 0,
      icon: <CheckCircleOutlined />, 
      color: '#52c41a'
    },
    {
      title: 'Prospects Rejetés',
      value: stats.prospects_rejetes || 0,
      icon: <CloseCircleOutlined />, 
      color: '#ff4d4f'
    },
    {
      title: 'Taux de Conversion Global',
      value: stats.taux_conversion_global || 0,
      suffix: '%',
      icon: <TrophyOutlined />, 
      color: '#13c2c2'
    },
    {
      title: 'Remises Total',
      value: stats.total_primes || 0,
      icon: <DollarOutlined />, 
      color: '#13c2c2'
    },
    {
      title: 'Remises Payées',
      value: stats.primes_payees || 0,
      icon: <TrophyOutlined />, 
      color: '#389e0d'
    },
    {
      title: 'Gains Globaux',
      value: `${(stats.total_gains_global || 0).toLocaleString()} F CFA`,
      icon: <RiseOutlined />, 
      color: '#52c41a'
    },
    {
      title: 'Gains en Attente',
      value: `${(stats.total_gains_en_attente || 0).toLocaleString()} F CFA`,
      icon: <FallOutlined />, 
      color: '#faad14'
    }
  ];

  // Données pour le graphique en camembert des prospects
  const prospectPieData = [
    { name: 'Confirmés', value: stats.prospects_confirmes || 0, color: '#52c41a' },
    { name: 'En Attente', value: stats.prospects_en_attente || 0, color: '#faad14' },
    { name: 'Rejetés', value: stats.prospects_rejetes || 0, color: '#ff4d4f' }
  ].filter(item => item.value > 0);

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Prospects',
      dataIndex: 'nb_prospects',
      key: 'nb_prospects',
      render: (val) => <Tag color="#1890ff">{val}</Tag>
    },
    {
      title: 'Confirmés',
      dataIndex: 'nb_prospects_confirmes',
      key: 'nb_prospects_confirmes',
      render: (val) => <Tag color="#52c41a">{val || 0}</Tag>
    },
    {
      title: 'Rejetés',
      dataIndex: 'nb_prospects_rejetes',
      key: 'nb_prospects_rejetes',
      render: (val) => <Tag color="#ff4d4f">{val || 0}</Tag>
    },
    {
      title: 'Taux Conv.',
      dataIndex: 'taux_conversion',
      key: 'taux_conversion',
      render: (val) => <Tag color="#13c2c2">{val || 0}%</Tag>
    },
    {
      title: 'Remises',
      dataIndex: 'nb_remises',
      key: 'nb_remises',
      render: (val) => <Tag color="#13c2c2">{val}</Tag>
    },
    {
      title: 'Gains',
      dataIndex: 'total_gains',
      key: 'total_gains',
      render: (val) => <Tag color="#52c41a">{val ? `${val.toLocaleString()} F CFA` : '0 F CFA'}</Tag>
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard Administrateur</Title>
      
      {/* Statistiques globales */}
      <Row gutter={[24, 24]}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={card.title}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                suffix={card.suffix}
                valueStyle={{ color: card.color, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Métriques des prospects */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Répartition des Prospects">
            <div style={{ height: 300 }}>
              {prospectPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prospectPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prospectPieData.map((entry, index) => (
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
        
        <Col xs={24} lg={12}>
          <Card title="Statistiques Détaillées">
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Confirmés</span>
                  <span>{stats.prospects_confirmes || 0} ({stats.total_prospects > 0 ? Math.round(((stats.prospects_confirmes || 0) / stats.total_prospects) * 100) : 0}%)</span>
                </div>
                <Progress 
                  percent={stats.total_prospects > 0 ? ((stats.prospects_confirmes || 0) / stats.total_prospects) * 100 : 0} 
                  strokeColor="#52c41a" 
                  showInfo={false}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>En Attente</span>
                  <span>{stats.prospects_en_attente || 0} ({stats.total_prospects > 0 ? Math.round(((stats.prospects_en_attente || 0) / stats.total_prospects) * 100) : 0}%)</span>
                </div>
                <Progress 
                  percent={stats.total_prospects > 0 ? ((stats.prospects_en_attente || 0) / stats.total_prospects) * 100 : 0} 
                  strokeColor="#faad14" 
                  showInfo={false}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Rejetés</span>
                  <span>{stats.prospects_rejetes || 0} ({stats.total_prospects > 0 ? Math.round(((stats.prospects_rejetes || 0) / stats.total_prospects) * 100) : 0}%)</span>
                </div>
                <Progress 
                  percent={stats.total_prospects > 0 ? ((stats.prospects_rejetes || 0) / stats.total_prospects) * 100 : 0} 
                  strokeColor="#ff4d4f" 
                  showInfo={false}
                />
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Statistic
                  title="Taux de Conversion Global"
                  value={stats.taux_conversion_global || 0}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Evolution des prospects */}
      {stats.evolution_prospects && (
        <Card style={{ marginTop: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>Évolution des inscriptions prospects (7 derniers jours)</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.evolution_prospects} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1890ff" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top influenceurs */}
      {stats.top_influenceurs && (
        <Card style={{ marginTop: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>Top Influenceurs</Title>
          <Table
            columns={columns}
            dataSource={stats.top_influenceurs}
            rowKey={(row) => row.id}
            pagination={false}
          />
        </Card>
      )}

      {/* Actions rapides */}
      <Card style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Actions Rapides</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              icon={<BarChartOutlined />}
              onClick={() => navigate('/admin/prospects-stats')}
              block
            >
              Statistiques Prospects
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<TeamOutlined />}
              onClick={() => navigate('/admin/prospects')}
              block
            >
              Gérer Prospects
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<UserOutlined />}
              onClick={() => navigate('/admin/influenceurs')}
              block
            >
              Gérer Influenceurs
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              icon={<DollarOutlined />}
              onClick={() => navigate('/admin/remises')}
              block
            >
              Gérer Remises
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminDashboard; 