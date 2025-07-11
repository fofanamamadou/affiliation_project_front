import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card,
  Typography,
  Tag,
  Tooltip,
  Select,
  message,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined,
  FilterOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;

const ProspectList = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    loadProspects();
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
    if (filterStatus === 'all') return true;
    return prospect.statut === filterStatus;
  });

  const confirmedProspects = prospects.filter(p => p.statut === 'confirme').length;
  const pendingProspects = prospects.filter(p => p.statut === 'en_attente').length;
  const totalProspects = prospects.length;

  const columns = [
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
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, marginBottom: '16px' }}>
            Mes Prospects
          </Title>
          
          {/* Statistiques */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Prospects"
                  value={totalProspects}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Confirmés"
                  value={confirmedProspects}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="En attente"
                  value={pendingProspects}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filtres */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 200 }}
              placeholder="Filtrer par statut"
            >
              <Option value="all">Tous les statuts</Option>
              <Option value="en_attente">En attente</Option>
              <Option value="confirme">Confirmés</Option>
              <Option value="rejete">Rejetés</Option>
            </Select>
          </div>
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
      </Card>
    </div>
  );
};

export default ProspectList; 