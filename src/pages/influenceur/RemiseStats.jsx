import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, message, Button } from 'antd';
import { EuroOutlined, CheckCircleOutlined, ClockCircleOutlined, FundOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RemiseStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'influenceur') {
      message.error('Accès non autorisé');
      navigate('/influenceur');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const result = await remiseService.getStatistiquesRemisesInfluenceur(user.id);
    if (result.success) {
      setStats(result.data);
    } else {
      message.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/influenceur/remises')}
            style={{ marginBottom: 16 }}
          >
            Retour à mes primes
          </Button>
          <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>Statistiques de mes Primes</Title>
        </div>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total de primes"
                value={stats?.total_remises || 0}
                prefix={<FundOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Primes payées"
                value={stats?.remises_payees || 0}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Primes en attente"
                value={stats?.remises_en_attente || 0}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Montant total (F CFA)"
                value={stats?.montant_total || 0}
                prefix={<EuroOutlined />}
                precision={2}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Montant payé (F CFA)"
                value={stats?.montant_paye || 0}
                prefix={<EuroOutlined style={{ color: '#52c41a' }} />}
                precision={2}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Montant en attente (F CFA)"
                value={stats?.montant_en_attente || 0}
                prefix={<EuroOutlined style={{ color: '#faad14' }} />}
                precision={2}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default RemiseStats;
export { RemiseStats }; 