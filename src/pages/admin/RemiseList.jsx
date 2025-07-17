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
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  EuroOutlined,
  UserOutlined,
  EyeOutlined,
  CalculatorOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';
import { influenceurService } from '../../services/influenceurService';

const { Title } = Typography;
const { Option } = Select;

const RemiseList = () => {
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [selectedRemise, setSelectedRemise] = useState(null);
  const [form] = Form.useForm();
  const [payForm] = Form.useForm();
  const [calcModal, setCalcModal] = useState(false);
  const [calcInfluModal, setCalcInfluModal] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [calcInfluId, setCalcInfluId] = useState();
  const [calcMontant, setCalcMontant] = useState(25000);
  const [influenceurs, setInfluenceurs] = useState([]);


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

  // Supprimer toute la logique et l'UI liée à la création de remise

  const handlePay = (remise) => {
    setSelectedRemise(remise);
    setPayModal(true);
    payForm.resetFields();
  };

  const handlePaySubmit = async (values) => {
    const file = values.justificatif?.file?.originFileObj;
    const result = await remiseService.payerRemise(selectedRemise.id, file);
    if (result.success) {
      message.success('Remise marquée comme payée');
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
    const result = await remiseService.calculerRemisesAutomatiques(calcMontant);
    setCalcLoading(false);
    setCalcResult(result);
    if (result.success) {
      message.success(result.data.detail || 'Remises calculées');
      loadRemises();
    } else {
      message.error(result.error);
    }
  };

  // Calcul pour un influenceur
  const handleCalcInflu = async () => {
    if (!calcInfluId) return message.error('ID influenceur requis');
    setCalcLoading(true);
    setCalcResult(null);
    const result = await remiseService.calculerRemiseInfluenceur(calcInfluId, calcMontant);
    setCalcLoading(false);
    setCalcResult(result);
    if (result.success) {
      message.success(result.data.detail || 'Remise calculée');
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
      title: 'Influenceur',
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
    // Suppression de la colonne justificatif
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
        </Space>
      ),
    },
  ];

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
            <Button icon={<CalculatorOutlined />} onClick={() => setCalcModal(true)} style={{ minWidth: 'clamp(120px, 20vw, 180px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Calculer automatiquement
            </Button>
            <Button icon={<CalculatorOutlined />} onClick={() => setCalcInfluModal(true)} style={{ minWidth: 'clamp(120px, 20vw, 180px)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Calculer pour un partenaire
            </Button>
          </Space>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={remises}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} primes`,
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
            {/* Suppression du champ justificatif */}
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
          title="Calcul automatique des primes (tous les influenceurs)"
          open={calcModal}
          onCancel={() => { setCalcModal(false); setCalcResult(null); }}
          onOk={handleCalcAuto}
          confirmLoading={calcLoading}
          width={window.innerWidth < 700 ? '95vw' : 600}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
        >
          <p>Montant par prospect confirmé :</p>
          <InputNumber min={1} value={calcMontant} onChange={setCalcMontant} style={{ width: 120, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} /> F CFA
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
        {/* Modal calcul influenceur */}
        <Modal
          title="Calcul automatique pour un influenceur (prime)"
          open={calcInfluModal}
          onCancel={() => { setCalcInfluModal(false); setCalcResult(null); }}
          onOk={handleCalcInflu}
          confirmLoading={calcLoading}
          width={window.innerWidth < 700 ? '95vw' : 600}
          style={{ top: 24 }}
          bodyStyle={{ padding: 'clamp(12px, 3vw, 24px)' }}
        >
          <p>Choisir un influenceur :</p>
          <Select
            showSearch
            placeholder="Sélectionner un influenceur"
            optionFilterProp="children"
            value={calcInfluId}
            onChange={setCalcInfluId}
            style={{ width: '100%', marginBottom: 16, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {influenceurs.map(inf => (
              <Option key={inf.id} value={inf.id}>
                {inf.nom} (ID: {inf.id})
              </Option>
            ))}
          </Select>
          <p style={{ marginTop: 16 }}>Montant par prospect confirmé :</p>
          <InputNumber min={1} value={calcMontant} onChange={setCalcMontant} style={{ width: 120, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} /> F CFA
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
      </Card>
    </div>
  );
};

export default RemiseList; 