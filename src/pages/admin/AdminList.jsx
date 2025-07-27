import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Card, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { influenceurService } from '../../services/influenceurService';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ visible: false, id: null, nom: '' });
  const [confirmInput, setConfirmInput] = useState('');
  const { userType } = useAuth();

  useEffect(() => {
    if (userType === 'superuser') {
      loadAdmins();
    }
  }, [userType]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const result = await influenceurService.getAllAdmins();
      if (result.success) {
        setAdmins(result.data);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const result = await influenceurService.createAdmin(values);
      if (result.success) {
        message.success('Admin créé avec succès');
        setModalVisible(false);
        loadAdmins();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Erreur lors de la création de l\'admin');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, nom) => {
    setDeletingId(id);
    try {
      const result = await influenceurService.deleteAdmin(id);
      if (result.success) {
        message.success(result.message || `Admin secondaire "${nom}" supprimé avec succès.`);
        loadAdmins();
      } else {
        message.error(result.error || `Erreur lors de la suppression de l'admin "${nom}".`);
      }
    } catch (error) {
      message.error(`Erreur lors de la suppression de l'admin "${nom}".`);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePopConfirm = (id, nom) => {
    setConfirmModal({ visible: true, id, nom });
    setConfirmInput('');
  };

  const handleFinalDelete = async () => {
    if (confirmModal.id && confirmInput === confirmModal.nom) {
      await handleDelete(confirmModal.id, confirmModal.nom);
      setConfirmModal({ visible: false, id: null, nom: '' });
      setConfirmInput('');
    }
  };

  const columns = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Popconfirm title={`Supprimer l'admin "${record.nom}" ?`} onConfirm={() => handlePopConfirm(record.id, record.nom)} okText="Oui" cancelText="Non">
        <Button danger icon={<DeleteOutlined />} loading={deletingId === record.id} />
      </Popconfirm>
    ) },
  ];

  if (userType !== 'superuser') {
    return <Card><Title level={4}>Accès réservé au superadmin</Title></Card>;
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f5f5f5' }}>
      <Card>
        <Title level={3}>Gestion des administrateurs secondaires</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginBottom: 16 }}>Créer un admin</Button>
        <Table columns={columns} dataSource={admins} loading={loading} rowKey="id" />
      </Card>
      <Modal
        title="Créer un nouvel admin"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={submitLoading}
        okText="Créer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="nom" label="Nom" rules={[{ required: true, message: 'Veuillez entrer le nom' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}> <Input /> </Form.Item>
          <Form.Item name="password" label="Mot de passe" rules={[{ required: true, message: 'Veuillez entrer un mot de passe' }]}> <Input.Password /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Confirmer la suppression de l'admin "${confirmModal.nom}"`}
        visible={confirmModal.visible}
        onCancel={() => setConfirmModal({ visible: false, id: null, nom: '' })}
        onOk={handleFinalDelete}
        okButtonProps={{
          disabled: confirmInput !== confirmModal.nom || deletingId === confirmModal.id,
          loading: deletingId === confirmModal.id
        }}
        okText="Supprimer définitivement"
        cancelText="Annuler"
      >
        <p>Pour confirmer la suppression, tapez le nom exact de l'admin :</p>
        <Input
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          placeholder="Nom de l'admin"
          autoFocus
        />
      </Modal>
    </div>
  );
};

export default AdminList; 