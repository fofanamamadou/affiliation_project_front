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
  TrophyOutlined,
  CloseCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { prospectService } from '../../services/prospectService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/exportCsv';

const { Title } = Typography;
const { Option } = Select;

const ProspectList = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { user, isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Vérification de sécurité
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        message.error('Vous devez être connecté pour accéder à cette page');
        navigate('/login-choice');
        return;
      }
      
      if (userType !== 'influenceur') {
        message.error('Accès non autorisé');
        navigate('/login-choice');
        return;
      }
    }
  }, [isAuthenticated, userType, authLoading, navigate]);

  useEffect(() => {
    if (!user || authLoading || !isAuthenticated || userType !== 'influenceur') return;
    loadProspects();
  }, [user, authLoading, isAuthenticated, userType]);

  const loadProspects = async () => {
    setLoading(true);
    try {
      // Utiliser le service influenceur pour récupérer les prospects de l'influenceur connecté
      const result = await prospectService.getInfluenceurProspects(user.id);
      if (result.success) {
        setProspects(result.data);
      } else {
        message.error(result.error);
        setProspects([]);
      }
    } catch (error) {
      // console.error('Erreur lors du chargement des prospects:', error);
      message.error('Erreur lors du chargement des prospects');
      setProspects([]);
    } finally {
      setLoading(false);
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
    if (filterStatus === 'all') return true;
    return prospect.statut === filterStatus;
  });

  const inscritsProspects = prospects.filter(p => p.statut === 'inscrit').length;
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
    }
  ];


  if (authLoading || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="ant-spin-dot">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'influenceur') {
    return null; // Redirection gérée par useEffect
  }

  return (
    <div className="partenaire-prospectlist-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Title level={3} style={{ 
            margin: 0, 
            marginBottom: 'clamp(12px, 3vw, 16px)', 
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 'bold'
          }}>
            Mes Prospects
          </Title>
          <Button
            icon={<DownloadOutlined />} 
            onClick={() => {
              const columnsToExport = [
                { title: 'Nom', dataIndex: 'nom' },
                { title: 'Email', dataIndex: 'email' },
                { title: 'Téléphone', dataIndex: 'telephone' },
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
              exportToCsv('mes_prospects.csv', dataToExport);
            }}
            disabled={filteredProspects.length === 0}
            style={{ minWidth: 44 }}
          >
            Exporter CSV
          </Button>
        </div>
        {/* Statistiques */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <Col xs={24} sm={8}>
            <Card style={{ height: '100%', borderRadius: '8px' }}>
              <Statistic
                title={<span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Total Prospects</span>}
                value={totalProspects}
                prefix={<UserOutlined />}
                valueStyle={{ 
                  color: '#1890ff', 
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ height: '100%', borderRadius: '8px' }}>
              <Statistic
                title={<span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Inscrits</span>}
                value={inscritsProspects}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ 
                  color: '#52c41a', 
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ height: '100%', borderRadius: '8px' }}>
              <Statistic
                title={<span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>En attente</span>}
                value={pendingProspects}
                prefix={<TrophyOutlined />}
                valueStyle={{ 
                  color: '#faad14', 
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
        </Row>
        {/* Filtres */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'clamp(12px, 3vw, 16px)', 
          gap: 'clamp(8px, 2vw, 12px)'
        }}>
          <Select
            showSearch
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ 
              minWidth: 'clamp(140px, 20vw, 200px)', 
              marginBottom: 8,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}
            placeholder="Filtrer par statut"
            filterOption={(input, option) => {
              if (!option || !option.children) return false;
              const text = typeof option.children === 'string' ? option.children : '';
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            notFoundContent="Aucun statut trouvé"
          >
            <Option value="all">Tous les statuts</Option>
            <Option value="en_attente">En attente</Option>
            <Option value="inscrit">Inscrits</Option>
            <Option value="rejeter">Rejetés</Option>
          </Select>
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