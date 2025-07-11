import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, message, Spin, Button } from 'antd';
import { UserOutlined, TeamOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, DownloadOutlined } from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const result = await adminService.getDashboardStats();
    if (result.success) {
      setStats(result.data);
    } else {
      message.error(result.error || 'Erreur lors du chargement des statistiques');
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><Spin size="large" /></div>;
  }

  const statCards = [
    {
      title: 'Influenceurs',
      value: stats.total_influenceurs,
      icon: <UserOutlined />, color: '#1890ff'
    },
    {
      title: 'Prospects',
      value: stats.total_prospects,
      icon: <TeamOutlined />, color: '#722ed1'
    },
    {
      title: 'En attente',
      value: stats.prospects_en_attente,
      icon: <ClockCircleOutlined />, color: '#faad14'
    },
    {
      title: 'Confirmés',
      value: stats.prospects_confirmes,
      icon: <CheckCircleOutlined />, color: '#52c41a'
    },
    {
      title: 'Primes',
      value: stats.total_primes,
      icon: <DollarOutlined />, color: '#13c2c2'
    },
    {
      title: 'Primes payées',
      value: stats.primes_payees,
      icon: <TrophyOutlined />, color: '#389e0d'
    },
    {
      title: 'Primes en attente',
      value: stats.primes_en_attente,
      icon: <ClockCircleOutlined />, color: '#faad14'
    }
  ];

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
      title: 'Primes',
      dataIndex: 'nb_primes',
      key: 'nb_primes',
      render: (val) => <Tag color="#13c2c2">{val}</Tag>
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
                valueStyle={{ color: card.color, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Evolution des prospects */}
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

      {/* Top influenceurs */}
      <Card style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Top Influenceurs</Title>
        <Table
          columns={columns}
          dataSource={stats.top_influenceurs}
          rowKey={(row) => row.nom}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard; 