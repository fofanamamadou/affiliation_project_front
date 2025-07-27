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
  Col,
  Divider,
  Space,
  Select
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CheckCircleOutlined,
  HomeOutlined,
  TrophyOutlined,
  BookOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { prospectService } from '../../services/prospectService';
import logoUniversite from '../../logo_universite.ico';
import backgroundImage from '../../background.jpg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AffiliationForm = () => {
  const { codeAffiliation } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [niveauEtude, setNiveauEtude] = useState('');
  const [serieBac, setSerieBac] = useState('');
  const [filiereSouhaitee, setFiliereSouhaitee] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      // Le numéro est déjà au format international
      const data = {
        nom: values.nom,
        email: values.email,
        telephone: values.telephone,
        niveau_etude: values.niveau_etude,
        niveau_etude_autre: values.niveau_etude_autre,
        serie_bac: values.serie_bac,
        serie_bac_autre: values.serie_bac_autre,
        filiere_souhaitee: values.filiere_souhaitee,
        filiere_autre: values.filiere_autre
      };
      const result = await prospectService.createProspectViaAffiliation(codeAffiliation, data);
      if (result.success) {
        setSuccess(true);
        message.success('Pré-inscription réussie !');
        form.resetFields();
      } else {
        setError(result.error);
        message.error(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la pré-inscription.');
      message.error('Une erreur est survenue lors de la pré-inscription.');
    } finally {
      setLoading(false);
    }
  };

  // Options pour les niveaux d'étude
  const niveauEtudeOptions = [
    { value: 'bac', label: 'Baccalauréat' },
    { value: 'licence', label: 'Licence' },
    { value: 'master', label: 'Master' },
    { value: 'autre', label: 'Autre' }
  ];

  // Options pour les séries du bac
  const serieBacOptions = [
    { value: 'tse', label: 'TSE - Sciences Exactes' },
    { value: 'tsexp', label: 'TSEXP - Sciences Expérimentales' },
    { value: 'tseco', label: 'TSECO - Sciences Économiques' },
    { value: 'tss', label: 'TSS - Sciences Sociales' },
    { value: 'tll', label: 'TLL - Lettres et Langues' },
    { value: 'autre', label: 'Autre' }
  ];

  // Options pour les filières
  const filiereOptions = [
    { value: 'ig', label: 'Informatique de Gestion' },
    { value: 'rit', label: 'Réseaux Informatiques et Télécommunications' },
    { value: 'irs', label: 'Ingénierie des Réseaux et Systèmes' },
    { value: 'gl', label: 'Génie Logiciel et Technologie Web / Analyste programmeur' },
    { value: 'gc', label: 'Génie Civil - Bâtiments et Infrastructures' },
    { value: 'gpg', label: 'Génie Pétrole et Gaz' },
    { value: 'fc', label: 'Finance Comptabilité' },
    { value: 'ba', label: 'Banque et Assurance' },
    { value: 'mm', label: 'Marketing - Management / Communication' },
    { value: 'grh', label: 'Gestion des Ressources Humaines' },
    { value: 'glt', label: 'Gestion de la Logistique et du Transport' },
    { value: 'cim', label: 'Commerce International et Marketing' },
    { value: 'gea', label: 'Gestion des Entreprises et des Administrations' },
    { value: 'audit', label: 'Audit et Contrôle de Gestion' },
    { value: 'autre', label: 'Autre' }
  ];

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px' 
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: '500px', 
          textAlign: 'center', 
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>
          <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '24px' }} />
          <Title level={2} style={{ color: '#52c41a', marginBottom: '16px' }}>
            Pré-inscription réussie !
          </Title>
          <Paragraph style={{ fontSize: '16px', marginBottom: '32px' }}>
            Félicitations ! Votre pré-inscription a été enregistrée avec succès. 
            Notre équipe vous contactera très prochainement pour finaliser votre inscription.
          </Paragraph>
          
          <Divider />
          
          <div style={{ margin: '24px 0' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Restez connecté avec nous
            </Title>
            <Paragraph style={{ marginBottom: '24px' }}>
              Suivez-nous sur nos réseaux sociaux pour ne manquer aucune information importante :
            </Paragraph>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
              <a
                href="https://www.linkedin.com/company/isatec-universit%C3%A9-bilingue/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="40" height="40" viewBox="0 0 32 32" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#0077B5"/>
                  <path d="M12.1 24H8.56V13.44H12.1V24ZM10.33 11.98C9.13 11.98 8.18 11.01 8.18 9.86C8.18 8.71 9.14 7.75 10.33 7.75C11.52 7.75 12.47 8.71 12.47 9.86C12.47 11.01 11.52 11.98 10.33 11.98ZM24 24H20.47V18.5C20.47 17.18 20.44 15.5 18.67 15.5C16.87 15.5 16.62 16.93 16.62 18.41V24H13.09V13.44H16.47V14.93H16.52C16.98 14.06 18.01 13.14 19.47 13.14C23.07 13.14 24 15.36 24 18.02V24Z" fill="white"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/ispatec.mali"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="40" height="40" viewBox="0 0 32 32" fill="#1877F3" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#1877F3"/>
                  <path d="M21.5 16H18V13.5C18 12.67 18.67 12 19.5 12H21.5V9H18C15.79 9 14 10.79 14 13V16H11V19H14V27H18V19H20.5L21.5 16Z" fill="white"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@ispatec"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                style={{ transition: 'transform 0.2s', display: 'inline-block' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              style={{ 
                width: '100%', 
                fontWeight: 'bold', 
                fontSize: 16,
                height: '48px',
                borderRadius: '8px'
              }}
            >
              Visitez notre site officiel
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px' 
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '600px', 
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <img 
              src={logoUniversite} 
              alt="Logo Université" 
              style={{ 
                width: '80px', 
                height: '80px', 
                marginBottom: '16px',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }} 
            />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1890ff', marginBottom: '8px' }}>
            Pré-inscription Université
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            Vous avez entendu parler de notre université ? 
            <br />
            Commencez votre aventure académique dès maintenant !
          </Paragraph>
        </div>

        {error && (
          <Alert 
            message="Erreur de pré-inscription" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: '24px' }} 
          />
        )}

        <Form
          form={form}
          name="affiliation"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nom"
                label={
                  <span>
                    <UserOutlined style={{ marginRight: '8px' }} />
                    Nom complet
                  </span>
                }
                rules={[
                  { required: true, message: 'Veuillez saisir votre nom complet' },
                  { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                ]}
              >
                <Input 
                  placeholder="Ex: Ousmane KANE" 
                  style={{ height: '48px', borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="telephone"
                label={<span><PhoneOutlined style={{ marginRight: '8px' }} />Numéro de téléphone</span>}
                rules={[
                  { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
                  { validator: (_, value) => {
                      if (!value || value.replace(/\D/g, '').length < 8 || value.replace(/\D/g, '').length > 15) {
                        return Promise.reject('Le numéro doit contenir entre 8 et 15 chiffres');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <PhoneInput
                  country={'ml'}
                  onlyCountries={['ml', 'ci', 'bf', 'sn', 'mr', 'ne', 'tg', 'bj', 'cm', 'ng', 'fr', 'us', 'gb']}
                  masks={{ml: '........'}}
                  inputStyle={{ width: '100%', height: 48, borderRadius: 8 }}
                  buttonStyle={{ borderRadius: 8 }}
                  placeholder="Numéro de téléphone"
                  inputProps={{ name: 'telephone', required: true, autoFocus: false }}
                  enableSearch
                  disableDropdown={false}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={
              <span>
                <MailOutlined style={{ marginRight: '8px' }} />
                Adresse email
              </span>
            }
            rules={[
              { type: 'email', message: 'Format d\'email invalide' }
            ]}
          >
            <Input 
              placeholder="votre.email@exemple.com (optionnel)" 
              autoComplete="email"
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="niveau_etude"
                label={
                  <span>
                    <TrophyOutlined style={{ marginRight: '8px' }} />
                    Niveau d'étude actuel
                  </span>
                }
                rules={[
                  { required: true, message: 'Veuillez sélectionner votre niveau d\'étude' }
                ]}
              >
                <Select
                  showSearch
                  placeholder="Sélectionnez votre niveau"
                  style={{ height: '48px', borderRadius: '8px' }}
                  onChange={(value) => setNiveauEtude(value)}
                  filterOption={(input, option) => {
                    if (!option || !option.children) return false;
                    const text = typeof option.children === 'string' ? option.children : '';
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  notFoundContent="Aucun niveau trouvé"
                >
                  {niveauEtudeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              {niveauEtude === 'autre' && (
                <Form.Item
                  name="niveau_etude_autre"
                  label="Précisez votre niveau"
                  rules={[
                    { required: true, message: 'Veuillez préciser votre niveau d\'étude' }
                  ]}
                >
                  <Input 
                    placeholder="Ex: BTS, DUT, etc." 
                    style={{ height: '48px', borderRadius: '8px' }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {niveauEtude === 'bac' && (
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="serie_bac"
                  label="Série du baccalauréat"
                  rules={[
                    { required: true, message: 'Veuillez sélectionner votre série du bac' }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Sélectionnez votre série"
                    style={{ height: '48px', borderRadius: '8px' }}
                    onChange={(value) => setSerieBac(value)}
                    filterOption={(input, option) => {
                      if (!option || !option.children) return false;
                      const text = typeof option.children === 'string' ? option.children : '';
                      return text.toLowerCase().includes(input.toLowerCase());
                    }}
                    notFoundContent="Aucune série trouvée"
                  >
                    {serieBacOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                {serieBac === 'autre' && (
                  <Form.Item
                    name="serie_bac_autre"
                    label="Précisez votre série"
                    rules={[
                      { required: true, message: 'Veuillez préciser votre série du bac' }
                    ]}
                  >
                    <Input 
                      placeholder="Ex: TSE, TSS, etc." 
                      style={{ height: '48px', borderRadius: '8px' }}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="filiere_souhaitee"
                label={
                  <span>
                    <BookOutlined style={{ marginRight: '8px' }} />
                    Filière souhaitée
                  </span>
                }
                rules={[
                  { required: true, message: 'Veuillez sélectionner une filière' }
                ]}
              >
                <Select
                  showSearch
                  placeholder="Sélectionnez votre filière"
                  style={{ height: '48px', borderRadius: '8px' }}
                  onChange={(value) => setFiliereSouhaitee(value)}
                  filterOption={(input, option) => {
                    if (!option || !option.children) return false;
                    const text = typeof option.children === 'string' ? option.children : '';
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  notFoundContent="Aucune filière trouvée"
                >
                  {filiereOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              {filiereSouhaitee === 'autre' && (
                <Form.Item
                  name="filiere_autre"
                  label="Précisez votre filière"
                  rules={[
                    { required: true, message: 'Veuillez préciser votre filière souhaitée' }
                  ]}
                >
                  <Input 
                    placeholder="Ex: Informatique, Commerce, etc." 
                    style={{ height: '48px', borderRadius: '8px' }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              icon={<TrophyOutlined />}
              style={{ 
                width: '100%', 
                height: '48px', 
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              {loading ? 'Enregistrement...' : 'Soumettre ma pré-inscription'}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            <BookOutlined style={{ marginRight: '8px' }} />
            En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe 
            pour finaliser votre inscription et recevoir plus d'informations sur nos programmes.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default AffiliationForm; 