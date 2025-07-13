import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space, Typography } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { key: '/admin', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/admin/influenceurs', icon: <UserOutlined />, label: 'Influenceurs' },
    { key: '/admin/prospects', icon: <TeamOutlined />, label: 'Prospects' },
    { key: '/admin/remises', icon: <DollarOutlined />, label: 'Remises' },
    { key: '/admin/statistiques', icon: <BarChartOutlined />, label: 'Statistiques' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login-choice');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: handleLogout
    }
  ];

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = () => {
    if (!user) return 'Admin';
    
    // Si l'utilisateur a un nom, l'utiliser
    if (user.nom) return user.nom;
    
    // Sinon utiliser l'email ou un nom par défaut
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Admin';
  };

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (!user) return 'A';
    
    if (user.nom) {
      return user.nom.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'A';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 style={{ 
            color: '#1890ff', 
            fontSize: collapsed ? '16px' : '20px',
            fontWeight: 'bold',
            margin: 0
          }}>
            {collapsed ? 'AP' : 'Admin Panel'}
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navigation.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} size="large" />
            </Badge>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer', padding: '8px' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff',
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
                    Administrateur
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px',
          minHeight: '280px'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 