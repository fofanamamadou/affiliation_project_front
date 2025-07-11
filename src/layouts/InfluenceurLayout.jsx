import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const InfluenceurLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      key: '/influenceur',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/influenceur/prospects',
      icon: <TeamOutlined />,
      label: 'Mes Prospects',
    },
    {
      key: '/influenceur/remises',
      icon: <DollarOutlined />,
      label: 'Mes Remises',
    },
    {
      key: '/influenceur/parametres',
      icon: <SettingOutlined />,
      label: 'Paramètres',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mon Profil',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = async ({ key }) => {
    if (key === 'logout') {
      await logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>Affiliation</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div>
            <Text strong>Espace Influenceur</Text>
          </div>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>Marie Martin</Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', background: '#f5f5f5', padding: '24px', borderRadius: '8px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default InfluenceurLayout; 