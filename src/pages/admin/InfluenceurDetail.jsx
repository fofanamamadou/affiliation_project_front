import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Statistic, 
  Divider,
  Table,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  Popconfirm,
  Spin,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined,
  TrophyOutlined,
  TeamOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import { influenceurService } from '../../services/influenceurService';
import { prospectService } from '../../services/prospectService';
import { remiseService } from '../../services/remiseService';
import ErrorAlert from '../../components/ErrorAlert';

const { Title, Text } = Typography;

const InfluenceurDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [influenceur, setInfluenceur] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInfluenceurData();
  }, [id]);

  const loadInfluenceurData = async () => {
    setLoading(true);
    setError('');

    try {
      // Charger les données de l'influenceur
      const influenceurResult = await adminService.getInfluenceur(id);
      if (!influenceurResult.success) {
        setError(influenceurResult.error);
        return;
      }
      setInfluenceur(influenceurResult.data);

      // Charger les prospects de l'influenceur
      const prospectsResult = await prospectService.getInfluenceurProspects(id);
      if (prospectsResult.success) {
        setProspects(prospectsResult.data);
      }

      // Charger les remises de l'influenceur
      const remisesResult = await remiseService.getInfluenceurRemises(id);
      if (remisesResult.success) {
        setRemises(remisesResult.data);
      }

    } catch (error) {
      // console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      nom: influenceur.nom,
      email: influenceur.email,
      telephone: influenceur.telephone
    });
    setEditModalVisible(true);
  };

  const handleSubmitEdit = async (values) => {
    setSubmitLoading(true);
    try {
      const result = await adminService.updateInfluenceur(id, values);
      if (result.success) {
        message.success('Influenceur mis à jour avec succès');
        setEditModalVisible(false);
        loadInfluenceurData(); // Recharger les données
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la mise à jour');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await adminService.deleteInfluenceur(id);
      if (result.success) {
        message.success('Influenceur supprimé avec succès');
        navigate('/admin/influenceurs');
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async () => {
    try {
      let result;
      if (influenceur.is_active) {
        result = await influenceurService.deactivateInfluenceur(influenceur.id);
        if (result.success) {
          message.success(`Partenaire désactivé avec succès !`);
        } else {
          message.error(result.error);
        }
      } else {
        result = await influenceurService.validateInfluenceur(influenceur.id);
        if (result.success) {
          message.success('Compte validé avec succès !');
        } else {
          message.error(result.error);
        }
      }
      loadInfluenceurData();
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirme':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'refuse':
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
      case 'refuse':
        return 'Refusé';
      default:
        return status;
    }
  };

  const getRemiseStatusColor = (status) => {
    switch (status) {
      case 'payee':
        return 'green';
      case 'valide':
        return 'blue';
      case 'en_attente':
        return 'orange';
      case 'refusee':
        return 'red';
      default:
        return 'default';
    }
  };

  const getRemiseStatusText = (status) => {
    switch (status) {
      case 'payee':
        return 'Payée';
      case 'valide':
        return 'Validée';
      case 'en_attente':
        return 'En attente';
      case 'refusee':
        return 'Refusée';
      default:
        return status;
    }
  };

  const prospectsColumns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text) => text || '-',
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Date d\'inscription',
      dataIndex: 'date_inscription',
      key: 'date_inscription',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
  ];

  const remisesColumns = [
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (montant) => `${montant} F CFA`,
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (status) => (
        <Tag color={getRemiseStatusColor(status)}>
          {getRemiseStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Date de paiement',
      dataIndex: 'date_paiement',
      key: 'date_paiement',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Chargement des données...</div>
      </div>
    );
  }

  if (!influenceur) {
    return (
      <div style={{ padding: '24px' }}>
        <ErrorAlert 
          error="Influenceur non trouvé"
          onClose={() => navigate('/admin/influenceurs')}
        />
      </div>
    );
  }

  const confirmedProspects = prospects.filter(p => p.statut === 'confirme').length;
  const totalProspects = prospects.length;
  const totalRemises = remises.length;
  const totalGains = remises
    .filter(r => r.statut === 'payee')
    .reduce((sum, r) => sum + (r.montant || 0), 0);

  return (
    <div className="admin-influenceurdetail-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px, 4vw, 24px)', gap: 'clamp(8px, 2vw, 12px)' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/influenceurs')}
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
          >
            Retour à la liste
          </Button>
          <Space wrap size={[8, 8]}>
            <Tooltip title={influenceur.is_active ? "Désactiver le partenaire" : "Valider le partenaire"}>
              <Button
                type="text"
                icon={influenceur.is_active ? <StopOutlined style={{ color: '#ff4d4f' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={handleToggleActive}
              />
            </Tooltip>
            <Button icon={<EditOutlined />} onClick={handleEdit} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Modifier</Button>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce partenaire ?"
              onConfirm={handleDelete}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger icon={<DeleteOutlined />} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Supprimer</Button>
            </Popconfirm>
          </Space>
        </div>
        <ErrorAlert 
          error={error}
          onClose={() => setError('')}
        />
        {/* Informations principales */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Informations personnelles</span>} style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Nom complet">{influenceur.nom}</Descriptions.Item>
                <Descriptions.Item label="Email">{influenceur.email}</Descriptions.Item>
                <Descriptions.Item label="Téléphone">{influenceur.telephone || 'Non renseigné'}</Descriptions.Item>
                <Descriptions.Item label="Code d'affiliation"><Tag color="blue" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{influenceur.code_affiliation}</Tag></Descriptions.Item>
                <Descriptions.Item label="Date d'inscription">{influenceur.date_creation ? new Date(influenceur.date_creation).toLocaleDateString('fr-FR') : 'Non disponible'}</Descriptions.Item>
                <Descriptions.Item label="Statut"><Tag color={influenceur.is_active ? 'green' : 'red'} style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{influenceur.is_active ? 'Actif' : 'Inactif'}</Tag></Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Statistiques</span>}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Prospects</span>}
                    value={totalProspects}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Confirmés</span>}
                    value={confirmedProspects}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Primes</span>}
                    value={totalRemises}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Gains totaux</span>}
                    value={Number(totalGains).toLocaleString()}
                    prefix={<DollarOutlined />}
                    suffix="F CFA"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Divider />
        {/* Prospects */}
        <Card title={<span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>Prospects de l'influenceur</span>} style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          {prospects.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <Table
                columns={prospectsColumns}
                dataSource={prospects}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} sur ${total} prospects`,
                  size: 'default',
                  responsive: true
                }}
                scroll={{ x: 'max-content' }}
                style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'clamp(30px, 8vw, 40px)', color: '#8c8c8c', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              Aucun prospect pour ce partenaire
            </div>
          )}
        </Card>
        {/* Remises */}
        <Card title={<span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>Primes du partenaire</span>}>
          {remises.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <Table
                columns={remisesColumns}
                dataSource={remises}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} sur ${total} primes`,
                  size: 'default',
                  responsive: true
                }}
                scroll={{ x: 'max-content' }}
                style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'clamp(30px, 8vw, 40px)', color: '#8c8c8c', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              Aucune prime pour ce partenaire
            </div>
          )}
        </Card>
      </Card>
      {/* Modal de modification */}
      <Modal
        title="Modifier le partenaire"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={window.innerWidth < 700 ? '95vw' : 600}
        style={{ top: 24 }}
        bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitEdit}
        >
          <Form.Item
            name="nom"
            label="Nom complet"
            rules={[
              { required: true, message: 'Le nom est requis' },
              { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
            ]}
          >
            <Input placeholder="Nom du partenaire" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'L\'email est requis' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input placeholder="email@exemple.com" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} />
          </Form.Item>
          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[
              { required: true, message: 'Le téléphone est requis' },
              { pattern: /^\d{8,15}$/, message: 'Le téléphone doit contenir entre 8 et 15 chiffres' }
            ]}
          >
            <Input placeholder="Numéro de téléphone" maxLength={15} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
                style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              >
                Sauvegarder
              </Button>
              <Button onClick={() => setEditModalVisible(false)} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InfluenceurDetail; 