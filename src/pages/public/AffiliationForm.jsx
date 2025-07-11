import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert, 
  message, 
  Row, 
  Col 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CheckCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { prospectService } from '../../services/prospectService';

const { Title, Text } = Typography;

const AffiliationForm = () => {
  const { codeAffiliation } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      const result = await prospectService.createProspectViaAffiliation(codeAffiliation, {
        nom: values.nom,
        email: values.email,
        telephone: values.telephone
      });
      if (result.success) {
        setSuccess(true);
        message.success('Inscription réussie !');
        form.resetFields();
      } else {
        setError(result.error);
        message.error(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de l\'inscription.');
      message.error('Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px' }}>
        <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center', borderRadius: '8px' }}>
          <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
          <Title level={2} style={{ color: '#52c41a', marginBottom: '16px' }}>
            Inscription réussie !
          </Title>
          <div style={{ margin: '24px 0' }}>
            <p>Suivez-nous sur nos différents réseaux sociaux :</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#0077B5"/>
                  <path d="M12.1 24H8.56V13.44H12.1V24ZM10.33 11.98C9.13 11.98 8.18 11.01 8.18 9.86C8.18 8.71 9.14 7.75 10.33 7.75C11.52 7.75 12.47 8.71 12.47 9.86C12.47 11.01 11.52 11.98 10.33 11.98ZM24 24H20.47V18.5C20.47 17.18 20.44 15.5 18.67 15.5C16.87 15.5 16.62 16.93 16.62 18.41V24H13.09V13.44H16.47V14.93H16.52C16.98 14.06 18.01 13.14 19.47 13.14C23.07 13.14 24 15.36 24 18.02V24Z" fill="white"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#1877F3" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#1877F3"/>
                  <path d="M21.5 16H18V13.5C18 12.67 18.67 12 19.5 12H21.5V9H18C15.79 9 14 10.79 14 13V16H11V19H14V27H18V19H20.5L21.5 16Z" fill="white"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#000"/>
                  <path d="M22.5 13.5C21.12 13.5 20 12.38 20 11V9H17.5V21C17.5 22.1 16.6 23 15.5 23C14.4 23 13.5 22.1 13.5 21C13.5 19.9 14.4 19 15.5 19C15.78 19 16.04 19.05 16.28 19.14V16.56C16.04 16.53 15.78 16.5 15.5 16.5C13.01 16.5 11 18.51 11 21C11 23.49 13.01 25.5 15.5 25.5C17.99 25.5 20 23.49 20 21V15.5C21.38 16.5 23.5 16.5 23.5 16.5V13.5H22.5Z" fill="#fff"/>
                </svg>
              </a>
            </div>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              href="https://ispatec.net/"
              target="_blank"
              style={{ width: '100%', fontWeight: 'bold', fontSize: 16 }}
            >
              Visitez la page principale de l'université
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Inscription Prospect
          </Title>
          <Text type="secondary">
            Remplissez ce formulaire pour devenir prospect via un influenceur
          </Text>
        </div>
        {error && (
          <Alert message="Erreur d'inscription" description={error} type="error" showIcon style={{ marginBottom: '16px' }} />
        )}
        <Form
          form={form}
          name="affiliation"
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
            <Input prefix={<UserOutlined />} placeholder="Votre nom" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email (optionnel)"
            rules={[
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="votre@email.com" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[
              { required: true, message: 'Veuillez saisir votre téléphone' },
              { pattern: /^[0-9]{8}$/, message: 'Le téléphone doit contenir exactement 8 chiffres' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Numéro à 8 chiffres" maxLength={8} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '40px' }}>
              S'inscrire
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AffiliationForm; 