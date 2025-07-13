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
  CheckCircleOutlined
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
      console.error('Erreur lors du chargement des données:', error);
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
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
  ];

  const remisesColumns = [
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (montant) => `${montant}€`,
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
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/influenceurs')}
            >
              Retour
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Détails de l'Influenceur
            </Title>
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Modifier
            </Button>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet influenceur ?"
              description="Cette action est irréversible."
              onConfirm={handleDelete}
              okText="Oui"
              cancelText="Non"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />}
              >
                Supprimer
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <ErrorAlert 
          error={error}
          onClose={() => setError('')}
        />

        {/* Informations principales */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Informations personnelles">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Nom complet">
                  {influenceur.nom}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {influenceur.email}
                </Descriptions.Item>
                <Descriptions.Item label="Téléphone">
                  {influenceur.telephone || 'Non renseigné'}
                </Descriptions.Item>
                <Descriptions.Item label="Code d'affiliation">
                  <Tag color="blue">{influenceur.code_affiliation}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Date d'inscription">
                  {influenceur.date_creation ? new Date(influenceur.date_creation).toLocaleDateString('fr-FR') : 'Non disponible'}
                </Descriptions.Item>
                <Descriptions.Item label="Statut">
                  <Tag color={influenceur.is_active ? 'green' : 'red'}>
                    {influenceur.is_active ? 'Actif' : 'Inactif'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Statistiques">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Prospects"
                    value={totalProspects}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Confirmés"
                    value={confirmedProspects}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Remises"
                    value={totalRemises}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Gains totaux"
                    value={totalGains}
                    prefix={<DollarOutlined />}
                    suffix="€"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Prospects */}
        <Card title="Prospects de l'influenceur" style={{ marginBottom: '24px' }}>
          {prospects.length > 0 ? (
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
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
              Aucun prospect pour cet influenceur
            </div>
          )}
        </Card>

        {/* Remises */}
        <Card title="Remises de l'influenceur">
          {remises.length > 0 ? (
            <Table
              columns={remisesColumns}
              dataSource={remises}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} sur ${total} remises`,
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
              Aucune remise pour cet influenceur
            </div>
          )}
        </Card>
      </Card>

      {/* Modal de modification */}
      <Modal
        title="Modifier l'influenceur"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
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
            <Input placeholder="Nom de l'influenceur" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'L\'email est requis' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input placeholder="email@exemple.com" />
          </Form.Item>

          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[
              { required: true, message: 'Le téléphone est requis' },
              { pattern: /^\d{8,15}$/, message: 'Le téléphone doit contenir entre 8 et 15 chiffres' }
            ]}
          >
            <Input placeholder="Numéro de téléphone" maxLength={15} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
              >
                Sauvegarder
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
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