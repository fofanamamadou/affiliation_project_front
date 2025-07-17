import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  message, 
  Typography, 
  Tag, 
  Row,
  Col,
  Statistic,
  Avatar
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  BookOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, userType } = useAuth();
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || userType !== 'influenceur') {
      message.error('Accès non autorisé');
      navigate('/influenceur');
      return;
    }
    loadProspect();
  }, [id, isAuthenticated, userType]);

  const loadProspect = async () => {
    setLoading(true);
    try {
      const result = await prospectService.getProspectById(id);
      if (result.success) {
        // Vérifier que le prospect appartient à l'influenceur connecté
        if (result.data.influenceur_details && result.data.influenceur_details.id !== user.id) {
          message.error('Accès non autorisé à ce prospect');
          navigate('/influenceur/prospects');
          return;
        }
        setProspect(result.data);
      } else {
        message.error(result.error || 'Erreur lors du chargement du prospect');
        navigate('/influenceur/prospects');
      }
    } catch (error) {
      message.error('Erreur lors du chargement du prospect');
      navigate('/influenceur/prospects');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      const result = await prospectService.validateProspect(id);
      if (result.success) {
        message.success('Prospect validé avec succès');
        loadProspect(); // Recharger les données
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la validation');
    }
  };

  const handleReject = async () => {
    try {
      const result = await prospectService.rejectProspect(id);
      if (result.success) {
        message.success('Prospect rejeté avec succès');
        loadProspect(); // Recharger les données
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors du rejet');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirme':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'rejeter':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirme':
        return 'Confirmé';
      case 'en_attente':
        return 'En attente';
      case 'rejeter':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirme':
        return <CheckCircleOutlined />;
      case 'en_attente':
        return <ClockCircleOutlined />;
      case 'rejeter':
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getNiveauEtudeText = (prospect) => {
    if (prospect.niveau_etude === 'autre' && prospect.niveau_etude_autre) {
      return prospect.niveau_etude_autre;
    }
    const niveaux = {
      'bac': 'Baccalauréat',
      'licence': 'Licence',
      'master': 'Master',
      'autre': 'Autre'
    };
    return niveaux[prospect.niveau_etude] || prospect.niveau_etude;
  };

  const getSerieBacText = (prospect) => {
    if (prospect.serie_bac === 'autre' && prospect.serie_bac_autre) {
      return prospect.serie_bac_autre;
    }
    const series = {
      'tse': 'TSE - Sciences Exactes',
      'tsexp': 'TSEXP - Sciences Expérimentales',
      'tseco': 'TSECO - Sciences Économiques',
      'tss': 'TSS - Sciences Sociales',
      'tll': 'TLL - Lettres et Langues',
      'autre': 'Autre'
    };
    return series[prospect.serie_bac] || prospect.serie_bac;
  };

  const getFiliereText = (prospect) => {
    if (prospect.filiere_souhaitee === 'autre' && prospect.filiere_autre) {
      return prospect.filiere_autre;
    }
    const filieres = {
      'ig': 'Informatique de Gestion',
      'rit': 'Réseaux Informatiques et Télécommunications',
      'irs': 'Ingénierie des Réseaux et Systèmes',
      'gl': 'Génie Logiciel et Technologie Web / Analyste programmeur',
      'gc': 'Génie Civil - Bâtiments et Infrastructures',
      'gpg': 'Génie Pétrole et Gaz',
      'fc': 'Finance Comptabilité',
      'ba': 'Banque et Assurance',
      'mm': 'Marketing - Management / Communication',
      'grh': 'Gestion des Ressources Humaines',
      'glt': 'Gestion de la Logistique et du Transport',
      'cim': 'Commerce International et Marketing',
      'gea': 'Gestion des Entreprises et des Administrations',
      'audit': 'Audit et Contrôle de Gestion',
      'autre': 'Autre'
    };
    return filieres[prospect.filiere_souhaitee] || prospect.filiere_souhaitee;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div>Prospect non trouvé</div>
      </div>
    );
  }

  return (
    <div className="partenaire-prospectdetail-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/influenceur/prospects')}
            style={{ 
              marginBottom: 'clamp(12px, 3vw, 16px)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}
          >
            Retour à la liste
          </Button>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 'clamp(12px, 3vw, 16px)'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'clamp(8px, 2vw, 12px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div>
                  <Title level={2} style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                    fontWeight: 'bold'
                  }}>
                    {prospect.nom}
                  </Title>
                  <Tag 
                    color={getStatusColor(prospect.statut)} 
                    icon={getStatusIcon(prospect.statut)}
                    style={{ 
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
                      padding: 'clamp(2px, 1vw, 4px) clamp(8px, 2vw, 12px)'
                    }}
                  >
                    {getStatusText(prospect.statut)}
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Informations personnelles</span>} 
              style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}
            >
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                <Descriptions.Item label="Nom complet" span={2}>
                  <Space>
                    <UserOutlined />
                    {prospect.nom}
                  </Space>
                </Descriptions.Item>
                
                <Descriptions.Item label="Email">
                  <Space>
                    <MailOutlined />
                    {prospect.email || '-'}
                  </Space>
                </Descriptions.Item>
                
                <Descriptions.Item label="Téléphone">
                  <Space>
                    <PhoneOutlined />
                    {prospect.telephone || '-'}
                  </Space>
                </Descriptions.Item>
                
                <Descriptions.Item label="Date d'inscription" span={2}>
                  <Space>
                    <CalendarOutlined />
                    {prospect.date_inscription ? 
                      dayjs(prospect.date_inscription).format('DD/MM/YYYY à HH:mm') : 
                      '-'
                    }
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card 
              title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Informations éducatives</span>} 
              style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}
            >
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                <Descriptions.Item label="Niveau d'étude">
                  <Space>
                    <BookOutlined />
                    {prospect.niveau_etude ? getNiveauEtudeText(prospect) : '-'}
                  </Space>
                </Descriptions.Item>
                
                {prospect.niveau_etude === 'bac' && (
                  <Descriptions.Item label="Série du bac">
                    <Space>
                      <TrophyOutlined />
                      {prospect.serie_bac ? getSerieBacText(prospect) : '-'}
                    </Space>
                  </Descriptions.Item>
                )}
                
                <Descriptions.Item label="Filière souhaitée" span={2}>
                  <Space>
                    <TrophyOutlined />
                    {prospect.filiere_souhaitee ? getFiliereText(prospect) : '-'}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Informations d'affiliation</span>}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Code d'affiliation">
                  {prospect.influenceur_details ? (
                    <Text code style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                      {prospect.influenceur_details.code_affiliation}
                    </Text>
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
                
                <Descriptions.Item label="Prime associée">
                  {prospect.remise_details ? (
                    <Tag color="green" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                      {prospect.remise_details.nom}
                    </Tag>
                  ) : (
                    <Text type="secondary">Aucune prime</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Statistiques</span>} style={{ marginTop: 'clamp(12px, 3vw, 16px)' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>ID Prospect</span>}
                    value={prospect.id}
                    valueStyle={{ 
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      fontWeight: 'bold'
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Statut</span>}
                    value={getStatusText(prospect.statut)}
                    valueStyle={{ 
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                      color: getStatusColor(prospect.statut) === 'green' ? '#52c41a' : 
                             getStatusColor(prospect.statut) === 'orange' ? '#faad14' : '#ff4d4f'
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProspectDetail; 