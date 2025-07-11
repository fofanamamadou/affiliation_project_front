import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Tooltip
} from 'antd';
import {
  EuroOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { remiseService } from '../../services/remiseService';

const { Title } = Typography;

const RemiseList = () => {
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRemises();
  }, []);

  const loadRemises = async () => {
    setLoading(true);
    const result = await remiseService.getAllRemises();
    if (result.success) {
      setRemises(result.data);
    }
    setLoading(false);
  };

  const columns = [
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
          {statut === 'payee' ? (
            <span><CheckCircleOutlined /> Payée</span>
          ) : (
            <span><ClockCircleOutlined /> En attente</span>
          )}
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => desc || '-',
    },
    {
      title: 'Justificatif',
      dataIndex: 'justificatif',
      key: 'justificatif',
      render: (justificatif) => justificatif ? (
        <Tooltip title="Télécharger le justificatif">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            href={justificatif}
            target="_blank"
            rel="noopener noreferrer"
          >
            Télécharger
          </Button>
        </Tooltip>
      ) : (
        <Tag color="default">Non disponible</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>Mes Primes</Title>
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
      </Card>
    </div>
  );
};

export default RemiseList; 