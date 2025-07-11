import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert,
  message
} from 'antd';
import { 
  LockOutlined, 
  MailOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'superuser') {
        navigate('/admin', { replace: true });
      } else if (userType === 'influenceur') {
        navigate('/influenceur', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(values);
      
      if (result.success) {
        // Redirection basée sur le type d'utilisateur
        const userType = localStorage.getItem('user_type');
        
        if (userType === 'superuser') {
          navigate('/admin');
        } else if (userType === 'influenceur') {
          navigate('/influenceur');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            background: '#1890ff', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <LoginOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Connexion
          </Title>
          <Text type="secondary">
            Accédez à votre espace personnel
          </Text>
        </div>

        {error && (
          <Alert
            message="Erreur de connexion"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
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
              prefix={<MailOutlined />} 
              placeholder="votre@email.com"
              autoComplete="email"
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
              prefix={<LockOutlined />} 
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: '40px' }}
              icon={<LoginOutlined />}
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: '#1890ff' }}>
              S'inscrire
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login; 