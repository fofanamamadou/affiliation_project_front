import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, message } from 'antd';
import { EuroOutlined, CheckCircleOutlined, ClockCircleOutlined, FundOutlined } from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';

const { Title } = Typography;

const RemiseStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const result = await remiseService.getStatistiquesRemises();
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
        <Title level={3} style={{ marginBottom: 24 }}>Statistiques des Remises</Title>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total remises"
                value={stats?.total_remises || 0}
                prefix={<FundOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Remises payées"
                value={stats?.remises_payees || 0}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Remises en attente"
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
                title="Montant total (€)"
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
                title="Montant payé (€)"
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
                title="Montant en attente (€)"
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