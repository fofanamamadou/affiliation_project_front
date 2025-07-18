import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Spin,
  message,
  Progress,
  Divider,
  Button
} from 'antd';
import { 
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProspectStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'influenceur') {
      message.error('Accès non autorisé');
      navigate('/influenceur');
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await prospectService.getProspectsStats();
      if (result.success) {
        setStats(result.data);
      } else {
        message.error(result.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      message.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Chargement des statistiques...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div>Aucune donnée disponible</div>
      </div>
    );
  }

  const tauxConversion = stats.taux_conversion || 0;
  const totalTraites = stats.confirme + stats.rejeter;

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/influenceur')}
            style={{ marginBottom: '16px' }}
          >
            Retour au dashboard
          </Button>
          
          <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
            Mes Statistiques Prospects
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          {/* Statistiques générales */}
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Total Prospects"
                value={stats.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="En attente"
                value={stats.en_attente}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Inscrits"
                value={stats.confirme}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Rejetés"
                value={stats.rejeter}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Métriques avancées */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Taux de Conversion" style={{ height: '100%' }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Progress
                  type="circle"
                  percent={tauxConversion}
                  format={percent => `${percent}%`}
                  strokeColor="#52c41a"
                  size={120}
                />
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">
                    {stats.confirme} inscrits sur {totalTraites} traités
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Répartition par Statut" style={{ height: '100%' }}>
              <div style={{ padding: '20px 0' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>En attente</span>
                    <span>{stats.en_attente} ({stats.total > 0 ? Math.round((stats.en_attente / stats.total) * 100) : 0}%)</span>
                  </div>
                  <Progress 
                    percent={stats.total > 0 ? (stats.en_attente / stats.total) * 100 : 0} 
                    strokeColor="#faad14" 
                    showInfo={false}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Inscrits</span>
                    <span>{stats.confirme} ({stats.total > 0 ? Math.round((stats.confirme / stats.total) * 100) : 0}%)</span>
                  </div>
                  <Progress 
                    percent={stats.total > 0 ? (stats.confirme / stats.total) * 100 : 0} 
                    strokeColor="#52c41a" 
                    showInfo={false}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Rejetés</span>
                    <span>{stats.rejeter} ({stats.total > 0 ? Math.round((stats.rejeter / stats.total) * 100) : 0}%)</span>
                  </div>
                  <Progress 
                    percent={stats.total > 0 ? (stats.rejeter / stats.total) * 100 : 0} 
                    strokeColor="#ff4d4f" 
                    showInfo={false}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Résumé */}
        <Row>
          <Col span={24}>
            <Card title="Résumé de mes Performances">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#1890ff' }}>
                      {stats.total}
                    </Title>
                    <Text type="secondary">Total de mes prospects</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#52c41a' }}>
                      {tauxConversion}%
                    </Title>
                    <Text type="secondary">Mon taux de conversion</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#faad14' }}>
                      {stats.en_attente}
                    </Title>
                    <Text type="secondary">En attente de traitement</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProspectStats; 