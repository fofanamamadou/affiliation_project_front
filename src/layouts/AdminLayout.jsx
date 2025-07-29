import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space, Typography, Drawer } from 'antd';
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
  UserSwitchOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import logoUniversite from '../logo_universite.ico';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const { logout, user, userType } = useAuth();
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 600;

  const menuItems = [
    { key: '/admin', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/admin/influenceurs', icon: <UserOutlined />, label: 'Partenaires' },
    { key: '/admin/prospects', icon: <TeamOutlined />, label: 'Prospects' },
    { key: '/admin/prospects-stats', icon: <BarChartOutlined />, label: 'Stats Prospects' },
    { key: '/admin/remises', icon: <DollarOutlined />, label: 'Primes' },
    { key: '/admin/remises-stats', icon: <BarChartOutlined />, label: 'Stats Primes' },
    // Ajout du menu pour la gestion des admins secondaires (superadmin uniquement) EN DERNIER
    ...(userType === 'superuser' ? [{ key: '/admin/admins', icon: <SafetyCertificateOutlined />, label: 'Admins secondaires' }] : [])
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
      {isMobile ? (
        <Drawer
          title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Admin Panel</span>}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>
            }))}
            style={{ borderRight: 0 }}
            onClick={() => setDrawerVisible(false)}
          />
        </Drawer>
      ) : (
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
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>
            }))}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}
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
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  <Text className="mobile-hide" type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
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