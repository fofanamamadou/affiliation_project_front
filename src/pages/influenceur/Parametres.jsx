import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Divider,
  Row,
  Col,
  Avatar,
  Space
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined,
  SaveOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { influenceurService } from '../../services/influenceurService';
import ErrorAlert from '../../components/ErrorAlert';

const { Title, Text } = Typography;

const Parametres = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { user, isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (user) {
      // Pré-remplir le formulaire avec les données de l'utilisateur
      form.setFieldsValue({
        nom: user.nom,
        email: user.email,
        telephone: user.telephone
      });
    }
  }, [user, form]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await influenceurService.updateInfluenceur(user.id, values);
      
      if (result.success) {
        message.success('Profil mis à jour avec succès');
        // Mettre à jour les données utilisateur dans le contexte
        // Note: Vous devrez peut-être ajouter une méthode pour rafraîchir les données utilisateur
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    setPasswordError('');

    try {
      const result = await influenceurService.updateInfluenceur(user.id, {
        password: values.newPassword
      });
      
      if (result.success) {
        message.success('Mot de passe modifié avec succès');
        passwordForm.resetFields();
      } else {
        setPasswordError(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setPasswordError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleFormChange = () => {
    if (error) setError('');
  };

  const handlePasswordFormChange = () => {
    if (passwordError) setPasswordError('');
  };

  if (!isAuthenticated || userType !== 'influenceur') {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Paramètres</Title>
      <Text type="secondary">Gérez vos informations personnelles et votre mot de passe</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Informations personnelles" style={{ marginBottom: '24px' }}>
            <ErrorAlert 
              error={error}
              onClose={() => setError('')}
              title="Erreur de mise à jour"
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileUpdate}
              onValuesChange={handleFormChange}
              preserve={true}
            >
              <Form.Item
                name="nom"
                label="Nom complet"
                rules={[
                  { required: true, message: 'Le nom est requis' },
                  { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Votre nom complet"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'L\'email est requis' },
                  { type: 'email', message: 'Email invalide' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="votre@email.com"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[
                  { required: true, message: 'Le téléphone est requis' },
                  { pattern: /^\d{8,15}$/, message: 'Le téléphone doit contenir entre 8 et 15 chiffres' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Numéro de téléphone"
                  maxLength={15}
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{ height: '40px' }}
                >
                  Sauvegarder les modifications
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Changer le mot de passe">
            <ErrorAlert 
              error={passwordError}
              onClose={() => setPasswordError('')}
              title="Erreur de changement de mot de passe"
            />

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
              onValuesChange={handlePasswordFormChange}
              preserve={true}
            >
              <Form.Item
                name="currentPassword"
                label="Mot de passe actuel"
                rules={[
                  { required: true, message: 'Le mot de passe actuel est requis' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Votre mot de passe actuel"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Nouveau mot de passe"
                rules={[
                  { required: true, message: 'Le nouveau mot de passe est requis' },
                  { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                ]}
              >
                <Input.Password 
                  prefix={<KeyOutlined />} 
                  placeholder="Nouveau mot de passe"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirmer le nouveau mot de passe"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Veuillez confirmer le nouveau mot de passe' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<KeyOutlined />} 
                  placeholder="Confirmez le nouveau mot de passe"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={passwordLoading}
                  icon={<KeyOutlined />}
                  style={{ height: '40px' }}
                >
                  Changer le mot de passe
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Informations du compte">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Space>
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Text strong>Code d'affiliation</Text>
                <br />
                <Text code>{user?.code_affiliation || 'Non disponible'}</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Date d'inscription</Text>
              <br />
              <Text type="secondary">
                {user?.date_creation ? new Date(user.date_creation).toLocaleDateString('fr-FR') : 'Non disponible'}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Parametres; 