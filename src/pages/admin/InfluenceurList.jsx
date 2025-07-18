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
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { influenceurService } from '../../services/influenceurService';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/exportCsv';

const { Title } = Typography;
const { Option } = Select;

const InfluenceurList = () => {
  const [influenceurs, setInfluenceurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInfluenceur, setEditingInfluenceur] = useState(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

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
      message.error('Erreur lors du chargement des partenaires');
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
        message.success('Partenaire supprimé avec succès');
        loadInfluenceurs();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      let result;
      if (editingInfluenceur) {
        result = await influenceurService.updateInfluenceur(editingInfluenceur.id, values);
      } else {
        // Filtrer les champs pour la création
        const data = {
          nom: values.nom,
          email: values.email,
          telephone: values.telephone,
          password: values.password
        };
        result = await influenceurService.createInfluenceur(data);
      }

      if (result.success) {
        message.success(editingInfluenceur ? 'Partenaire mis à jour' : 'Partenaire créé');
        setModalVisible(false);
        loadInfluenceurs();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    } finally {
      setSubmitLoading(false);
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
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text) => text || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
      title: 'Prime par prospect (F CFA)',
      dataIndex: 'prime_par_prospect_cfa',
      key: 'prime_par_prospect_cfa',
      render: (val) => val ? val.toLocaleString() : '-',
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
            title="Êtes-vous sûr de vouloir supprimer ce partenaire ?"
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
          <Tooltip title={record.is_active ? "Désactiver le partenaire" : "Valider le partenaire"}>
            <Popconfirm
              title={record.is_active ? "Êtes-vous sûr de vouloir désactiver ce partenaire ?" : "Êtes-vous sûr de vouloir valider ce partenaire ?"}
              onConfirm={() => handleToggleActive(record)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                type="text"
                icon={record.is_active ? <StopOutlined style={{ color: '#ff4d4f' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    navigate(`/admin/influenceurs/${record.id}`);
  };

  const handleValidateInfluenceur = async (id) => {
    try {
      const result = await influenceurService.validateInfluenceur(id);
      if (result.success) {
        message.success('Compte validé avec succès !');
        loadInfluenceurs();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la validation');
    }
  };

  const handleToggleActive = async (record) => {
    try {
      let result;
      if (record.is_active) {
        result = await influenceurService.deactivateInfluenceur(record.id);
        if (result.success) {
          message.success(`Partenaire désactivé avec succès !`);
        } else {
          message.error(result.error);
        }
      } else {
        result = await influenceurService.validateInfluenceur(record.id);
        if (result.success) {
          message.success('Compte validé avec succès !');
        } else {
          message.error(result.error);
        }
      }
      loadInfluenceurs();
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
  };

  const filteredInfluenceurs = influenceurs.filter((influ) => {
    const search = searchText.toLowerCase();
    return (
      influ.nom?.toLowerCase().includes(search) ||
      influ.email?.toLowerCase().includes(search) ||
      influ.telephone?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="admin-influenceurlist-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'clamp(12px, 3vw, 16px)',
          gap: 'clamp(8px, 2vw, 12px)'
        }}>
          <Title level={3} style={{ margin: 0, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 'bold' }}>
            Gestion des Partenaires
          </Title>
          <div style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(8px, 2vw, 12px)'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Input.Search
                allowClear
                placeholder="Rechercher par nom, email ou téléphone"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ minWidth: 'clamp(140px, 30vw, 300px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)', width: '100%' }}
              />
            </div>
            <div style={{ minWidth: 'clamp(120px, 20vw, 180px)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button
                icon={<DownloadOutlined />} 
                onClick={() => {
                  const columnsToExport = [
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Nom', dataIndex: 'nom' },
                    { title: 'Téléphone', dataIndex: 'telephone' },
                    { title: 'Email', dataIndex: 'email' },
                    { title: 'Code Affiliation', dataIndex: 'code_affiliation' },
                    { title: 'Prime par prospect (F CFA)', dataIndex: 'prime_par_prospect_cfa', render: (val) => val ? val.toLocaleString() : '-' },
                    { title: 'Statut', dataIndex: 'is_active', render: (isActive) => isActive ? 'Actif' : 'Inactif' },
                    { title: 'Date de création', dataIndex: 'date_creation', render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-' },
                  ];
                  const dataToExport = filteredInfluenceurs.map(row => {
                    const obj = {};
                    columnsToExport.forEach(col => {
                      obj[col.title] = col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex];
                    });
                    return obj;
                  });
                  exportToCsv('partenaires.csv', dataToExport);
                }}
                disabled={filteredInfluenceurs.length === 0}
                style={{ minWidth: 44 }}
              >
                Exporter CSV
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ width: '100%', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              >
                Nouvel Partenaire
              </Button>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={filteredInfluenceurs}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} sur ${total} partenaires`,
              size: 'default',
              responsive: true
            }}
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
          />
        </div>
        <Modal
          title={editingInfluenceur ? 'Modifier le partenaire' : 'Nouvel partenaire'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={window.innerWidth < 700 ? '95vw' : 600}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
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
              <Input placeholder="Nom du partenaire" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} />
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
            {!editingInfluenceur && (
              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[
                  { required: true, message: 'Le mot de passe est requis' },
                  { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                ]}
              >
                <Input.Password placeholder="Mot de passe" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} />
              </Form.Item>
            )}
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Annuler
                </Button>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
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