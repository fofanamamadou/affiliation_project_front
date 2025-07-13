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
  const { logout, user } = useAuth();

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
      onClick: () => {
        navigate('/influenceur/parametres');
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: async () => {
        await logout();
        navigate('/login-choice');
      }
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = () => {
    if (!user) return 'Influenceur';
    
    // Si l'utilisateur a un nom, l'utiliser
    if (user.nom) return user.nom;
    
    // Sinon utiliser l'email ou un nom par défaut
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Influenceur';
  };

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (!user) return 'I';
    
    if (user.nom) {
      return user.nom.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'I';
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
            }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer', padding: '8px' }}>
              <Avatar 
                style={{ 
                  backgroundColor: '#52c41a',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                {getInitials()}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text strong style={{ fontSize: '14px', lineHeight: '1.2' }}>
                  {getDisplayName()}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                  Influenceur
                </Text>
              </div>
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