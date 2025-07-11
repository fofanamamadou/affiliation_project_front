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
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await register(values);
      
      if (result.success) {
        message.success('Inscription réussie !');
        navigate('/influenceur');
      } else {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Register error:', error);
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
            <UserAddOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Inscription Influenceur
          </Title>
          <Text type="secondary">
            Rejoignez notre plateforme d'affiliation
          </Text>
        </div>

        {error && (
          <Alert
            message="Erreur d'inscription"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="nom"
            label="Nom complet"
            rules={[
              { required: true, message: 'Veuillez saisir votre nom' },
              { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Votre nom complet"
            />
          </Form.Item>

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
              { required: true, message: 'Veuillez saisir votre mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Votre mot de passe"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmer le mot de passe"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirmez votre mot de passe"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: '40px' }}
              icon={<UserAddOutlined />}
            >
              S'inscrire
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">
            Déjà inscrit ?{' '}
            <a href="/login" style={{ color: '#1890ff' }}>
              Se connecter
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register; 