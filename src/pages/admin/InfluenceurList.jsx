import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm,
  Card,
  Typography,
  Tag,
  Tooltip,
  Switch,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { influenceurService } from '../../services/influenceurService';

const { Title } = Typography;
const { Option } = Select;

const InfluenceurList = () => {
  const [influenceurs, setInfluenceurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInfluenceur, setEditingInfluenceur] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadInfluenceurs();
  }, []);

  const loadInfluenceurs = async () => {
    setLoading(true);
    try {
      const result = await influenceurService.getAllInfluenceurs();
      if (result.success) {
        setInfluenceurs(result.data);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des influenceurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingInfluenceur(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingInfluenceur(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await influenceurService.deleteInfluenceur(id);
      if (result.success) {
        message.success('Influenceur supprimé avec succès');
        loadInfluenceurs();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (values) => {
    try {
      let result;
      if (editingInfluenceur) {
        result = await influenceurService.updateInfluenceur(editingInfluenceur.id, values);
      } else {
        // Filtrer les champs pour la création
        const data = {
          nom: values.nom,
          email: values.email,
          password: values.password
        };
        result = await influenceurService.createInfluenceur(data);
      }

      if (result.success) {
        message.success(editingInfluenceur ? 'Influenceur mis à jour' : 'Influenceur créé');
        setModalVisible(false);
        loadInfluenceurs();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
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
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: 'Code Affiliation',
      dataIndex: 'code_affiliation',
      key: 'code_affiliation',
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir les détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cet influenceur ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Tooltip title="Supprimer">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    // TODO: Implémenter la vue détaillée
    message.info('Fonctionnalité à implémenter');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3} style={{ margin: 0 }}>
            Gestion des Influenceurs
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Nouvel Influenceur
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={influenceurs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} influenceurs`,
          }}
        />

        <Modal
          title={editingInfluenceur ? 'Modifier l\'influenceur' : 'Nouvel influenceur'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
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

            {!editingInfluenceur && (
              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[
                  { required: true, message: 'Le mot de passe est requis' },
                  { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                ]}
              >
                <Input.Password placeholder="Mot de passe" />
              </Form.Item>
            )}

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Annuler
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingInfluenceur ? 'Modifier' : 'Créer'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default InfluenceurList; 