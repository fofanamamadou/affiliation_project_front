import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Button } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  ShareAltOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InfluenceurDashboard = () => {
  const [stats, setStats] = useState({
    totalProspects: 0,
    totalRemises: 0,
    totalGains: 0,
    tauxConversion: 0
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalProspects: 45,
        totalRemises: 18,
        totalGains: 3600,
        tauxConversion: 40
      });
      setChartData([
        { name: 'Jan', prospects: 8, remises: 3 },
        { name: 'Fév', prospects: 12, remises: 5 },
        { name: 'Mar', prospects: 10, remises: 4 },
        { name: 'Avr', prospects: 15, remises: 6 },
      ]);
      setPieData([
        { name: 'Remises validées', value: 18, color: '#52c41a' },
        { name: 'En attente', value: 5, color: '#faad14' },
        { name: 'Refusées', value: 2, color: '#ff4d4f' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
      value: `${stats.totalGains.toLocaleString()}€`,
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

  const recentProspects = [
    {
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      status: 'validé',
      montant: 150,
      date: '2024-01-15'
    },
    {
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      status: 'en_attente',
      montant: 200,
      date: '2024-01-14'
    },
    {
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      status: 'validé',
      montant: 100,
      date: '2024-01-13'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'validé': return 'green';
      case 'en_attente': return 'orange';
      case 'refusé': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'validé': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'refusé': return 'Refusé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="ant-spin-dot">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
    );
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
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Répartition des remises">
            <div style={{ height: '300px' }}>
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
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Prospects */}
      <Card 
        title="Prospects récents" 
        extra={
          <Button type="primary" icon={<ShareAltOutlined />}>
            Partager mon lien
          </Button>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={recentProspects}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.name}
                description={item.email}
              />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {item.montant}€
                </div>
                <Tag color={getStatusColor(item.status)}>
                  {getStatusText(item.status)}
                </Tag>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default InfluenceurDashboard; 