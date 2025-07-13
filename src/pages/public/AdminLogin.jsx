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
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminLogin, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, userType, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(values);
      
      if (result.success) {
        message.success('Connexion administrateur réussie');
        navigate('/admin');
      } else {
        setError(result.error);
        // Ne pas réinitialiser le formulaire en cas d'erreur
      }
      
    } catch (error) {
      console.error('Admin login error:', error);
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
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)'
          }}>
            <SafetyCertificateOutlined style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
            Administration
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Accès sécurisé à l'espace administrateur
          </Text>
        </div>

        <ErrorAlert 
          error={error}
          onClose={() => setError('')}
          title="Erreur de connexion"
        />

        <Form
          form={form}
          name="adminLogin"
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          layout="vertical"
          size="large"
          preserve={true}
        >
          <Form.Item
            name="email"
            label="Email administrateur"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#ff6b6b' }} />} 
              placeholder="admin@exemple.com"
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
              prefix={<LockOutlined style={{ color: '#ff6b6b' }} />} 
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
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Vous êtes un influenceur ?{' '}
            <a href="/influenceur/login" style={{ color: '#1890ff', fontWeight: '500' }}>
              Connectez-vous ici
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin; 