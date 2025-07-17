import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  UserAddOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';

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
      // Préparer les données selon le format attendu par le backend
      const userData = {
        nom: values.nom,
        email: values.email,
        password: values.password,
        telephone: values.telephone
      };

      const result = await register(userData);
      
      if (result.success) {
        message.success('Inscription réussie !');
        navigate('/influenceur/login');
      } else {
        setError(result.error);
        // Ne pas réinitialiser le formulaire en cas d'erreur
      }
      
    } catch (error) {
      // console.error('Register error:', error);
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
              <UserAddOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: 0, color: '#2c3e50', fontWeight: '600', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>
              Inscription Partenaire
            </Title>
            <Text type="secondary" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              Rejoignez notre plateforme d'affiliation
            </Text>
          </div>
          <ErrorAlert 
            error={error}
            onClose={() => setError('')}
            title="Erreur d'inscription"
          />
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            layout="vertical"
            size="large"
            preserve={true}
            style={{ width: '100%' }}
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
                prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Votre nom complet"
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
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
                prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
                placeholder="votre@email.com"
                autoComplete="email"
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
              />
            </Form.Item>
            <Form.Item
              name="telephone"
              label="Téléphone"
              rules={[
                { required: true, message: 'Veuillez saisir votre téléphone' },
                { pattern: /^\d{8,15}$/, message: 'Le téléphone doit contenir entre 8 et 15 chiffres' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Numéro de téléphone"
                maxLength={15}
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
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
                prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Votre mot de passe"
                autoComplete="new-password"
                style={{ height: 48, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
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
                prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Confirmez votre mot de passe"
                autoComplete="new-password"
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
                icon={<UserAddOutlined />}
              >
                S'inscrire
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
              Déjà inscrit ?{' '}
              <a href="/influenceur/login" style={{ color: '#1890ff', fontWeight: 500 }}>
                Se connecter
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
        © {yearDisplay} - Développé par <b>Mamadou FOFANA</b> | Contact : <a href="mailto:madoufof94@gmail.com">madoufof94@gmail.com</a> | WhatsApp : <a href="https://wa.me/22193528994" target="_blank" rel="noopener noreferrer">93528994</a>
      </footer>
    </>
  );
};

export default Register; 