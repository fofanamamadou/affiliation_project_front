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

  const handlePartenaireLogin = () => {
    navigate('/influenceur/login');
  };

  const creationYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = creationYear === currentYear ? creationYear : `${creationYear}-${currentYear}`;

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4vw 2vw',
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: 600,
            minWidth: 0,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            border: 'none',
            margin: '0 auto',
          }}
          bodyStyle={{ padding: '24px 8px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>
              Choisissez votre espace
            </Title>
            <Text type="secondary" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              Sélectionnez le type de compte pour vous connecter
            </Text>
          </div>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: 16,
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
                bodyStyle={{ padding: '24px 8px' }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)'
                }}>
                  <SafetyCertificateOutlined style={{ fontSize: 36, color: 'white' }} />
                </div>
                <Title level={3} style={{ margin: '0 0 12px', color: '#ff6b6b', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
                  Administration
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 20, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                  Accès sécurisé à l'espace administrateur pour la gestion du système
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    border: 'none',
                    borderRadius: 8,
                    height: 44,
                    width: '100%',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)'
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
                  transition: 'all 0.3s ease',
                  marginBottom: 16,
                }}
                onClick={handlePartenaireLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                bodyStyle={{ padding: '24px 8px' }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                }}>
                  <StarOutlined style={{ fontSize: 36, color: 'white' }} />
                </div>
                <Title level={3} style={{ margin: '0 0 12px', color: '#1890ff', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
                  Espace Partenaire
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 20, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                  Accédez à votre espace personnel pour gérer vos prospects et remises
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    borderRadius: 8,
                    height: 44,
                    width: '100%',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)'
                  }}
                  icon={<UserOutlined />}
                >
                  Se connecter
                </Button>
              </Card>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Text type="secondary" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Nouveau sur la plateforme ?{' '}
              <a href="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
                Créez votre compte partenaire
              </a>
            </Text>
          </div>
        </Card>
      </div>
      <footer style={{
        textAlign: 'center',
        padding: '16px 0 0 0',
        color: '#888',
        fontSize: 13,
        background: 'transparent',
        marginTop: 0
      }}>
        © {yearDisplay} - Développé par <b>Mamadou FOFANA</b> (Étudiant à ISPATEC) | Contact : <a href="mailto:madoufof94@gmail.com">madoufof94@gmail.com</a> | WhatsApp : <a href="https://wa.me/22393528994" target="_blank" rel="noopener noreferrer">93528994</a>
      </footer>
    </>
  );
};

export default LoginChoice; 