import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Card,
  Typography,
  Tag,
  Tooltip,
  Upload,
  Select,
  InputNumber,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  EuroOutlined,
  UserOutlined,
  EyeOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';
import { influenceurService } from '../../services/influenceurService';
import { exportToCsv } from '../../utils/exportCsv';

const { Title } = Typography;
const { Option } = Select;

const RemiseList = () => {
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [selectedRemise, setSelectedRemise] = useState(null);
  const [payForm] = Form.useForm();
  const [calcModal, setCalcModal] = useState(false);
  const [primeModal, setPrimeModal] = useState(false);
  const [primeInfluId, setPrimeInfluId] = useState();
  const [primeMontant, setPrimeMontant] = useState(25000);
  const [primeLoading, setPrimeLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [influenceurs, setInfluenceurs] = useState([]);
  const [filterInfluenceur, setFilterInfluenceur] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');

  useEffect(() => {
    loadRemises();
    loadInfluenceurs();
  }, []);

  const loadRemises = async () => {
    setLoading(true);
    const result = await remiseService.getAllRemises();
    if (result.success) {
      setRemises(result.data);
    } else {
      message.error(result.error);
    }
    setLoading(false);
  };

  const loadInfluenceurs = async () => {
    const result = await influenceurService.getAllInfluenceurs();
    if (result.success) {
      setInfluenceurs(result.data);
    }
  };

  const handlePay = (remise) => {
    setSelectedRemise(remise);
    setPayModal(true);
    payForm.resetFields();
  };

  const handlePaySubmit = async (values) => {
    const file = values.justificatif?.file?.originFileObj;
    const result = await remiseService.payerRemise(selectedRemise.id, file);
    if (result.success) {
      message.success('Prime marquée comme payée');
      setPayModal(false);
      loadRemises();
    } else {
      message.error(result.error);
    }
  };

  // Calcul automatique pour tous
  const handleCalcAuto = async () => {
    setCalcLoading(true);
    setCalcResult(null);
    const result = await remiseService.calculerRemisesAutomatiques();
    setCalcLoading(false);
    setCalcResult(result);
    if (result.success) {
      message.success(result.data.detail || 'Primes calculées');
      loadRemises();
    } else {
      message.error(result.error);
    }
  };

  // Définir la prime d'un influenceur
  const handlePrimeSubmit = async () => {
    if (!primeInfluId) return message.error('Veuillez sélectionner un partenaire');
    if (!primeMontant || primeMontant < 1) return message.error('Montant invalide');
    setPrimeLoading(true);
    const result = await influenceurService.definirPrimeInfluenceur(primeInfluId, primeMontant);
    setPrimeLoading(false);
    if (result.success) {
      message.success('Prime modifiée avec succès');
      setPrimeModal(false);
      loadInfluenceurs();
    } else {
      message.error(result.error);
    }
  };

  const handleDeleteRemise = async (remiseId) => {
    const result = await remiseService.deleteRemise(remiseId);
    if (result.success) {
      message.success('Prime supprimée avec succès');
      loadRemises();
    } else {
      message.error(result.error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Partenaire',
      key: 'influenceur',
      render: (text, record) => (
        record.influenceur_details ? (
          <Space><UserOutlined />{record.influenceur_details.nom}</Space>
        ) : (
          <Tag>-</Tag>
        )
      ),
    },
    {
      title: 'Montant (F CFA)',
      dataIndex: 'montant',
      key: 'montant',
      render: (val) => <b>{val} F CFA</b>,
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag color={statut === 'payee' ? 'green' : 'orange'}>
          {statut === 'payee' ? 'Payée' : 'En attente'}
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
      title: 'Prospect(s) concerné(s)',
      dataIndex: 'prospects',
      key: 'prospects',
      render: (prospects) =>
        prospects && prospects.length > 0
          ? prospects.map(p => p.nom).join(', ')
          : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.statut !== 'payee' && (
            <Tooltip title="Marquer comme payée">
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handlePay(record)} />
            </Tooltip>
          )}
          <Tooltip title="Supprimer la prime">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette prime ?"
              onConfirm={() => handleDeleteRemise(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredRemises = remises.filter(remise => {
    const influenceurOk = filterInfluenceur === 'all' ? true : (remise.influenceur_details && remise.influenceur_details.id === filterInfluenceur);
    const statutOk = filterStatut === 'all' ? true : remise.statut === filterStatut;
    return influenceurOk && statutOk;
  });

  return (
    <div className="admin-remiselist-responsive" style={{ padding: 'clamp(12px, 3vw, 24px)', minHeight: '100vh', background: '#f5f5f5' }}>
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
            Gestion des Primes
          </Title>
          <Space style={{ flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 12px)' }}>
            <Select
              showSearch
              allowClear={false}
              value={filterInfluenceur}
              onChange={setFilterInfluenceur}
              style={{ minWidth: 180, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
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
            <Select
              showSearch
              allowClear={false}
              value={filterStatut}
              onChange={setFilterStatut}
              style={{ minWidth: 150, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              placeholder="Filtrer par statut"
            >
              <Option value="all">Tous les statuts</Option>
              <Option value="en_attente">En attente</Option>
              <Option value="payee">Payée</Option>
            </Select>
            <Button
              icon={<DownloadOutlined />} 
              onClick={() => {
                const columnsToExport = [
                  { title: 'ID', dataIndex: 'id' },
                  { title: 'Partenaire', dataIndex: 'influenceur_details', render: (inf) => inf ? inf.nom : '-' },
                  { title: 'Montant (F CFA)', dataIndex: 'montant', render: (val) => val ? `${val} F CFA` : '-' },
                  { title: 'Statut', dataIndex: 'statut', render: (statut) => statut === 'payee' ? 'Payée' : 'En attente' },
                  { title: 'Date de création', dataIndex: 'date_creation', render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-' },
                  { title: 'Prospect(s) concerné(s)', dataIndex: 'prospects', render: (prospects) => prospects && prospects.length > 0 ? prospects.map(p => p.nom).join(', ') : '-' },
                ];
                const dataToExport = filteredRemises.map(row => {
                  const obj = {};
                  columnsToExport.forEach(col => {
                    obj[col.title] = col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex];
                  });
                  return obj;
                });
                exportToCsv('primes.csv', dataToExport);
              }}
              disabled={filteredRemises.length === 0}
              style={{ minWidth: 44 }}
            >
              Exporter CSV
            </Button>
            {/*
            <Button icon={<CalculatorOutlined />} onClick={() => setCalcModal(true)} style={{ minWidth: 'clamp(120px, 20vw, 180px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Générer les primes
            </Button>
            */}
            <Button icon={<EditOutlined />} onClick={() => setPrimeModal(true)} style={{ minWidth: 'clamp(120px, 20vw, 180px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Définir la prime d'un partenaire
            </Button>
          </Space>
        </div>
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            dataSource={filteredRemises}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} sur ${total} primes`,
              size: 'default',
              responsive: true
            }}
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
          />
        </div>
        {/* Modal paiement */}
        <Modal
          title="Paiement de la Prime"
          open={payModal}
          onCancel={() => setPayModal(false)}
          footer={null}
          width={window.innerWidth < 700 ? '95vw' : 600}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
        >
          <Form form={payForm} layout="vertical" onFinish={handlePaySubmit}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button onClick={() => setPayModal(false)} style={{ marginRight: 8 }}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                Valider le paiement
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* Modal calcul automatique */}
        <Modal
          title="Génération des primes (tous les partenaires)"
          open={calcModal}
          onCancel={() => { setCalcModal(false); setCalcResult(null); }}
          onOk={handleCalcAuto}
          confirmLoading={calcLoading}
          width={window.innerWidth < 700 ? '95vw' : 600}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
        >
          <p>Cette opération va générer les primes pour tous les prospects inscrits n'ayant pas encore de prime, en utilisant la prime définie pour chaque partenaire.</p>
          {calcResult && (
            <div style={{ marginTop: 16 }}>
              {calcResult.success ? (
                <Tag color="green">{calcResult.data.detail}</Tag>
              ) : (
                <Tag color="red">{calcResult.error}</Tag>
              )}
            </div>
          )}
        </Modal>
        {/* Modal définir la prime d'un influenceur */}
        <Modal
          title="Définir la prime d'un partenaire"
          open={primeModal}
          onCancel={() => {
            setPrimeModal(false);
            setPrimeInfluId(undefined);
            setPrimeMontant(25000);
          }}
          onOk={handlePrimeSubmit}
          confirmLoading={primeLoading}
          width={window.innerWidth < 700 ? '95vw' : 500}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
        >
          <p>Choisir un partenaire :</p>
          <Select
            showSearch
            placeholder="Sélectionner un partenaire"
            value={primeInfluId}
            onChange={setPrimeInfluId}
            style={{ width: '100%', marginBottom: 16, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
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
            {influenceurs.map(inf => (
              <Option key={inf.id} value={inf.id} label={`${inf.nom} (ID: ${inf.id})`}>
                {inf.nom} (ID: {inf.id})
              </Option>
            ))}
          </Select>
          <p style={{ marginTop: 16 }}>Montant de la prime (F CFA) :</p>
          <InputNumber 
            min={1} 
            value={primeMontant} 
            onChange={setPrimeMontant} 
            style={{ width: 180, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} 
          /> F CFA
        </Modal>
      </Card>
    </div>
  );
};

export default RemiseList; 