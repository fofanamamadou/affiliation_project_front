import React from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Row, 
  Col,
  Space
} from 'antd';
import { 
  SafetyCertificateOutlined,
  StarOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginChoice = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleInfluenceurLogin = () => {
    navigate('/influenceur/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
            Choisissez votre espace
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Sélectionnez le type de compte pour vous connecter
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={handleAdminLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff6b6b';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)'
              }}>
                <SafetyCertificateOutlined style={{ fontSize: '36px', color: 'white' }} />
              </div>
              <Title level={3} style={{ margin: '0 0 12px', color: '#ff6b6b' }}>
                Administration
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                Accès sécurisé à l'espace administrateur pour la gestion du système
              </Text>
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '44px',
                  width: '100%'
                }}
                icon={<LockOutlined />}
              >
                Se connecter
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={handleInfluenceurLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
              }}>
                <StarOutlined style={{ fontSize: '36px', color: 'white' }} />
              </div>
              <Title level={3} style={{ margin: '0 0 12px', color: '#1890ff' }}>
                Espace Influenceur
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                Accédez à votre espace personnel pour gérer vos prospects et remises
              </Text>
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '44px',
                  width: '100%'
                }}
                icon={<UserOutlined />}
              >
                Se connecter
              </Button>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Nouveau sur la plateforme ?{' '}
            <a href="/register" style={{ color: '#1890ff', fontWeight: '500' }}>
              Créez votre compte influenceur
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginChoice; 