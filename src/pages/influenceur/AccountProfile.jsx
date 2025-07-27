import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Spin, Avatar } from 'antd';
import { UserOutlined, LockOutlined, EditOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { influenceurService } from '../../services/influenceurService';
import ErrorAlert from '../../components/ErrorAlert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Title } = Typography;

const AccountProfile = () => {
  const { user, loading: authLoading, refreshUserData } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSubmitLoading, setProfileSubmitLoading] = useState(false);
  const [passwordSubmitLoading, setPasswordSubmitLoading] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        profession: user.profession,
      });
      setLoading(false);
    }
  }, [user, profileForm]);

  const onFinishProfile = async (values) => {
    setProfileSubmitLoading(true);
    setProfileError('');
    try {
      const dataToUpdate = {
        nom: values.nom,
        telephone: values.telephone,
        profession: values.profession,
      };
      const result = await influenceurService.updateInfluenceurProfile(user.id, dataToUpdate);
      if (result.success) {
        message.success('Profil mis à jour avec succès');
        try {
          await refreshUserData(); // Met à jour les données dans le contexte
        } catch (refreshError) {
          message.warning("Profil mis à jour, mais une erreur est survenue lors du rafraîchissement des données.");
        }
      } else {
        setProfileError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setProfileError('Une erreur est survenue.');
    } finally {
      setProfileSubmitLoading(false);
    }
  };

  const onFinishPassword = async (values) => {
    setPasswordSubmitLoading(true);
    setPasswordError('');
    try {
      const result = await influenceurService.changePassword(values);
      if (result.success) {
        message.success('Mot de passe modifié avec succès');
        passwordForm.resetFields();
      } else {
        setPasswordError(result.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      setPasswordError('Une erreur est survenue.');
    } finally {
      setPasswordSubmitLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Mon Compte</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Informations Personnelles" icon={<EditOutlined />}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={96} icon={<UserOutlined />} src={user.avatarUrl} />
              <Title level={4} style={{ marginTop: '16px' }}>{user.nom}</Title>
            </div>
            <ErrorAlert error={profileError} onClose={() => setProfileError('')} />
            <Form form={profileForm} layout="vertical" onFinish={onFinishProfile}>
              <Form.Item name="nom" label="Nom complet" rules={[{ required: true, message: 'Le nom est requis' }]}>
                <Input prefix={<UserOutlined />} placeholder="Votre nom complet" />
              </Form.Item>
              <Form.Item name="email" label="Email (non modifiable)">
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
              <Form.Item name="telephone" label="Téléphone" rules={[
                { required: true, message: 'Le téléphone est requis' },
                { validator: (_, value) => {
                    if (!value || value.replace(/\D/g, '').length < 8 || value.replace(/\D/g, '').length > 15) {
                      return Promise.reject('Le téléphone doit contenir entre 8 et 15 chiffres');
                    }
                    return Promise.resolve();
                  }
                }
              ]}>
                <PhoneInput
                  country={'ml'}
                  onlyCountries={['ml', 'ci', 'bf', 'sn', 'mr', 'ne', 'tg', 'bj', 'cm', 'ng', 'fr', 'us', 'gb']}
                  masks={{ml: '........'}}
                  inputStyle={{ width: '100%', fontSize: 'clamp(1rem, 2vw, 1.1rem)', borderRadius: 8 }}
                  buttonStyle={{ borderRadius: 8 }}
                  placeholder="Votre numéro de téléphone"
                  inputProps={{ name: 'telephone', required: true, autoFocus: false }}
                  enableSearch
                  disableDropdown={false}
                />
              </Form.Item>
              <Form.Item name="profession" label="Profession (optionnel)">
                <Input prefix={<UserOutlined />} placeholder="Votre profession" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={profileSubmitLoading} icon={<SaveOutlined />}>
                  Sauvegarder les modifications
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Changer le mot de passe" icon={<KeyOutlined />}>
            <ErrorAlert error={passwordError} onClose={() => setPasswordError('')} />
            <Form form={passwordForm} layout="vertical" onFinish={onFinishPassword}>
              <Form.Item
                name="current_password"
                label="Mot de passe actuel"
                rules={[{ required: true, message: 'Veuillez saisir votre mot de passe actuel' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe actuel" />
              </Form.Item>
              <Form.Item
                name="new_password"
                label="Nouveau mot de passe"
                rules={[
                  { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
                  { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label="Confirmer le nouveau mot de passe"
                dependencies={['new_password']}
                rules={[
                  { required: true, message: 'Veuillez confirmer votre nouveau mot de passe' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Les nouveaux mots de passe ne correspondent pas'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le nouveau mot de passe" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={passwordSubmitLoading} danger icon={<SaveOutlined />}>
                  Changer le mot de passe
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountProfile; 