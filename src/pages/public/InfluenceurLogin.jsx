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
        message.success('Connexion influenceur réussie');
        navigate('/influenceur');
      } else {
        setError(result.error);
        // Ne pas réinitialiser le formulaire en cas d'erreur
      }
      
    } catch (error) {
      console.error('Influenceur login error:', error);
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
          maxWidth: '450px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
          }}>
            <StarOutlined style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
            Espace Influenceur
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
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
              style={{ height: '48px' }}
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
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%', 
                height: '48px',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
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

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: '#1890ff', fontWeight: '500' }}>
              S'inscrire
            </a>
          </Text>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Vous êtes un administrateur ?{' '}
            <a href="/admin/login" style={{ color: '#ff6b6b', fontWeight: '500' }}>
              Connectez-vous ici
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default InfluenceurLogin; 