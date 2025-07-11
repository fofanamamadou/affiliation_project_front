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
  CalculatorOutlined
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
  const [calcMontant, setCalcMontant] = useState(10);
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
      title: 'Montant (€)',
      dataIndex: 'montant',
      key: 'montant',
      render: (val) => <b>{val} €</b>,
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir les détails">
            <Button type="text" icon={<EyeOutlined />} onClick={() => message.info('À venir')} />
          </Tooltip>
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
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>Gestion des Primes</Title>
          <Space>
            <Button icon={<CalculatorOutlined />} onClick={() => setCalcModal(true)}>
              Calculer automatiquement
            </Button>
            <Button icon={<CalculatorOutlined />} onClick={() => setCalcInfluModal(true)}>
              Calculer pour un influenceur
            </Button>
            {/* Bouton Nouvelle Prime supprimé */}
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={remises}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} primes`,
          }}
        />
        {/* Modal paiement */}
        <Modal
          title="Paiement de la Prime"
          open={payModal}
          onCancel={() => setPayModal(false)}
          footer={null}
        >
          <Form form={payForm} layout="vertical" onFinish={handlePaySubmit}>
            <Form.Item name="justificatif" label="Justificatif de paiement" valuePropName="fileList" getValueFromEvent={e => e && e.fileList} rules={[{ required: true, message: 'Justificatif requis' }]}> 
              <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.jpeg,.png">
                <Button icon={<UploadOutlined />}>Uploader un justificatif</Button>
              </Upload>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button onClick={() => setPayModal(false)} style={{ marginRight: 8 }}>Annuler</Button>
              <Button type="primary" htmlType="submit">Valider le paiement</Button>
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
        >
          <p>Montant par prospect confirmé :</p>
          <InputNumber min={1} value={calcMontant} onChange={setCalcMontant} style={{ width: 120 }} /> €
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
        >
          <p>ID Influenceur :</p>
          <InputNumber min={1} value={calcInfluId} onChange={setCalcInfluId} style={{ width: 120, marginRight: 16 }} />
          <p style={{ marginTop: 16 }}>Montant par prospect confirmé :</p>
          <InputNumber min={1} value={calcMontant} onChange={setCalcMontant} style={{ width: 120 }} /> €
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