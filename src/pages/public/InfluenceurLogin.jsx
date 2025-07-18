import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message,
  Divider
} from 'antd';
import { 
  LockOutlined, 
  MailOutlined,
  LoginOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';

const { Title, Text } = Typography;

const InfluenceurLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { influenceurLogin, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && userType === 'influenceur') {
      navigate('/influenceur', { replace: true });
    }
  }, [isAuthenticated, userType, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await influenceurLogin(values);
      
      if (result.success) {
        message.success('Connexion partenaire réussie');
        navigate('/influenceur');
      } else {
        setError(result.error);
        // Ne pas réinitialiser le formulaire en cas d'erreur
      }
      
    } catch (error) {
      // console.error('Influenceur login error:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
      // Ne pas réinitialiser le formulaire en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = () => {
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (error) {
      setError('');
    }
  };

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
            maxWidth: 450,
            minWidth: 0,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            border: 'none',
            margin: '0 auto',
          }}
          bodyStyle={{ padding: '24px 8px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
            }}>
              <StarOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>
              Espace Partenaire
            </Title>
            <Text type="secondary" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              Accédez à votre espace personnel
            </Text>
          </div>
          <ErrorAlert 
            error={error}
            onClose={() => setError('')}
            title="Erreur de connexion"
          />
          <Form
            form={form}
            name="influenceurLogin"
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            layout="vertical"
            size="large"
            preserve={true}
            style={{ width: '100%' }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Veuillez saisir votre email' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
                placeholder="votre@email.com"
                autoComplete="email"
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[
                { required: true, message: 'Veuillez saisir votre mot de passe' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ 
                  width: '100%', 
                  height: 48,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: 500
                }}
                icon={<LoginOutlined />}
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>
          <Divider style={{ margin: '24px 0' }}>
            <Text type="secondary">ou</Text>
          </Divider>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Pas encore de compte ?{' '}
              <a href="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
                S'inscrire
              </a>
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Vous êtes un administrateur ?{' '}
              <a href="/admin/login" style={{ color: '#ff6b6b', fontWeight: 500 }}>
                Connectez-vous ici
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
        © {new Date().getFullYear()} - Développé par <b>Mamadou FOFANA</b> (Étudiant à ISPATEC) | Contact : <a href="mailto:madoufof94@gmail.com">madoufof94@gmail.com</a> | WhatsApp : <a href="https://wa.me/22193528994" target="_blank" rel="noopener noreferrer">93528994</a>
      </footer>
    </>
  );
};

export default InfluenceurLogin; 