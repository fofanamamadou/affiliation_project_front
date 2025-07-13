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
  Select,
  DatePicker
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { influenceurService } from '../../services/influenceurService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const ProspectList = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInfluenceur, setFilterInfluenceur] = useState('all');
  const [influenceurs, setInfluenceurs] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    loadProspects();
    loadInfluenceurs();
  }, []);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const result = await prospectService.getAllProspects();
      if (result.success) {
        setProspects(result.data);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des prospects');
    } finally {
      setLoading(false);
    }
  };

  const loadInfluenceurs = async () => {
    const result = await influenceurService.getAllInfluenceurs();
    if (result.success) {
      setInfluenceurs(result.data);
    }
  };

  const handleCreate = () => {
    setEditingProspect(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProspect(record);
    form.setFieldsValue({
      ...record,
      date_inscription: record.date_inscription ? dayjs(record.date_inscription) : null
    });
    setModalVisible(true);
  };

  const handleValidate = async (prospectId) => {
    try {
      const result = await prospectService.validateProspect(prospectId);
      if (result.success) {
        message.success('Prospect validé avec succès');
        loadProspects();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la validation');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        date_inscription: values.date_inscription ? values.date_inscription.toISOString() : null
      };

      let result;
      if (editingProspect) {
        // Pour l'instant, on ne peut que valider les prospects
        result = await prospectService.validateProspect(editingProspect.id);
      } else {
        result = await prospectService.createProspect(formData);
      }

      if (result.success) {
        message.success(editingProspect ? 'Prospect mis à jour' : 'Prospect créé');
        setModalVisible(false);
        loadProspects();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirme':
        return 'green';
      case 'en_attente':
        return 'orange';
      case 'rejete':
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
      case 'rejete':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const statusOk = filterStatus === 'all' ? true : prospect.statut === filterStatus;
    const influenceurOk = filterInfluenceur === 'all' ? true : (prospect.influenceur_details && prospect.influenceur_details.id === filterInfluenceur);
    return statusOk && influenceurOk;
  });

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
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text) => text || '-',
    },
    {
      title: 'Influenceur',
      key: 'influenceur',
      render: (text, record) => (
        record.influenceur_details ? (
          <Tag color="blue">{record.influenceur_details.nom}</Tag>
        ) : (
          <Tag>-</Tag>
        )
      ),
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
          {record.statut !== 'confirme' && (
            <Tooltip title="Valider">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleValidate(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Modifier">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    // TODO: Créer une page de détails pour les prospects
    message.info('Page de détails du prospect à implémenter');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3} style={{ margin: 0 }}>
            Gestion des Prospects
          </Title>
          <Space>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              placeholder="Filtrer par statut"
            >
              <Option value="all">Tous les statuts</Option>
              <Option value="en_attente">En attente</Option>
              <Option value="confirme">Confirmés</Option>
            </Select>
            <Select
              value={filterInfluenceur}
              onChange={setFilterInfluenceur}
              style={{ width: 200 }}
              placeholder="Filtrer par influenceur"
            >
              <Option value="all">Tous les influenceurs</Option>
              {influenceurs.map(inf => (
                <Option key={inf.id} value={inf.id}>{inf.nom} ({inf.code_affiliation})</Option>
              ))}
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProspects}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} prospects`,
          }}
        />

        {/* Modal création */}
        {/* (Supprimé : pas de modal de création de prospect pour l'admin) */}
      </Card>
    </div>
  );
};

export default ProspectList; 