import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Popconfirm,
  Card,
  Typography,
  Tag,
  Tooltip,
  Select,
  Input
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined,
  FilterOutlined,
  CloseCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { influenceurService } from '../../services/influenceurService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/exportCsv';

const { Title } = Typography;
const { Option } = Select;

const ProspectList = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInfluenceur, setFilterInfluenceur] = useState('all');
  const [influenceurs, setInfluenceurs] = useState([]);
  const [searchText, setSearchText] = useState("");
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

  const handleReject = async (prospectId) => {
    try {
      const result = await prospectService.rejectProspect(prospectId);
      if (result.success) {
        message.success('Prospect rejeté avec succès');
        loadProspects();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors du rejet');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'inscrit':
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
      case 'inscrit':
        return 'Inscrit';
      case 'en_attente':
        return 'En attente';
      case 'rejeter':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const search = searchText.toLowerCase();
    const match =
      prospect.nom?.toLowerCase().includes(search) ||
      prospect.email?.toLowerCase().includes(search) ||
      prospect.telephone?.toLowerCase().includes(search);
    const statusOk = filterStatus === 'all' ? true : prospect.statut === filterStatus;
    const influenceurOk = filterInfluenceur === 'all' ? true : (prospect.influenceur_details && prospect.influenceur_details.id === filterInfluenceur);
    return statusOk && influenceurOk && match;
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
      title: 'Partenaire',
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
      render: (status, record) => (
        status !== 'en_attente' ? (
          <Popconfirm
            title={`Remettre ce prospect en attente ?`}
            onConfirm={async () => {
              const result = await prospectService.remettreEnAttenteProspect(record.id);
              if (result.success) {
                message.success('Prospect remis en attente');
                loadProspects();
              } else {
                message.error(result.error);
              }
            }}
            okText="Oui"
            cancelText="Non"
          >
            <Tag color={getStatusColor(status)} style={{ cursor: 'pointer' }}>
              {getStatusText(status)}
            </Tag>
          </Popconfirm>
        ) : (
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
        )
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
          {record.statut !== 'inscrit' && record.statut !== 'rejeter' && (
            <Tooltip title="Valider l'inscription">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleValidate(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.statut !== 'rejeter' && record.statut !== 'inscrit' && (
            <Tooltip title="Rejeter">
              <Popconfirm
                title="Êtes-vous sûr de vouloir rejeter ce prospect ?"
                onConfirm={() => handleReject(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  style={{ color: '#ff4d4f' }}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    navigate(`/admin/prospects/${record.id}`);
  };

  return (
    <div className="admin-prospectlist-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
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
            Gestion des Prospects
          </Title>
          <Space wrap size={[8, 8]}>
            <Button
              icon={<DownloadOutlined />} 
              onClick={() => {
                const columnsToExport = [
                  { title: 'ID', dataIndex: 'id' },
                  { title: 'Nom', dataIndex: 'nom' },
                  { title: 'Email', dataIndex: 'email' },
                  { title: 'Téléphone', dataIndex: 'telephone' },
                  { title: 'Partenaire', dataIndex: 'influenceur_details', render: (val) => val ? val.nom : '-' },
                  { title: 'Statut', dataIndex: 'statut', render: getStatusText },
                  { title: "Date d'inscription", dataIndex: 'date_inscription', render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-' },
                ];
                const dataToExport = filteredProspects.map(row => {
                  const obj = {};
                  columnsToExport.forEach(col => {
                    obj[col.title] = col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex];
                  });
                  return obj;
                });
                exportToCsv('prospects.csv', dataToExport);
              }}
              disabled={filteredProspects.length === 0}
              style={{ minWidth: 44 }}
            >
              Exporter CSV
            </Button>
            <Input.Search
              allowClear
              placeholder="Rechercher par nom, email ou téléphone"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ minWidth: 'clamp(140px, 30vw, 300px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
            />
            <Select
              showSearch
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ minWidth: 'clamp(120px, 20vw, 150px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              placeholder="Filtrer par statut"
              filterOption={(input, option) => {
                const text = option.label || '';
                return text
                  .toLowerCase()
                  .normalize('NFD').replace(/\u0300-\u036f/g, '')
                  .includes(
                    input
                      .toLowerCase()
                      .normalize('NFD').replace(/\u0300-\u036f/g, '')
                  );
              }}
              notFoundContent="Aucun statut trouvé"
            >
              <Option value="all" label="Tous les statuts">Tous les statuts</Option>
              <Option value="en_attente" label="En attente">En attente</Option>
              <Option value="inscrit" label="Inscrits">Inscrits</Option>
              <Option value="rejeter" label="Rejetés">Rejetés</Option>
            </Select>
            <Select
              showSearch
              value={filterInfluenceur}
              onChange={setFilterInfluenceur}
              style={{ minWidth: 'clamp(140px, 25vw, 200px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              placeholder="Filtrer par partenaire"
              filterOption={(input, option) => {
                const text = option.label || '';
                return text
                  .toLowerCase()
                  .normalize('NFD').replace(/\u0300-\u036f/g, '')
                  .includes(
                    input
                      .toLowerCase()
                      .normalize('NFD').replace(/\u0300-\u036f/g, '')
                  );
              }}
              notFoundContent="Aucun partenaire trouvé"
            >
              <Option value="all" label="Tous les partenaires">Tous les partenaires</Option>
              {influenceurs.map(inf => (
                <Option key={inf.id} value={inf.id} label={`${inf.nom} (${inf.code_affiliation})`}>
                  {inf.nom} ({inf.code_affiliation})
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            dataSource={filteredProspects}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} sur ${total} prospects`,
              size: 'default',
              responsive: true
            }}
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProspectList; 