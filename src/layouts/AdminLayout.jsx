import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Badge } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  TeamOutlined, 
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { key: '/admin', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/admin/influenceurs', icon: <UserOutlined />, label: 'Influenceurs' },
    { key: '/admin/prospects', icon: <TeamOutlined />, label: 'Prospects' },
    { key: '/admin/remises', icon: <DollarOutlined />, label: 'Remises' },
    { key: '/admin/statistiques', icon: <BarChartOutlined />, label: 'Statistiques' }
  ];

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
            <Avatar icon={<UserOutlined />} />
            <span style={{ fontWeight: '500' }}>Admin</span>
            <Button type="primary" danger onClick={async () => { await logout(); navigate('/login'); }}>
              Déconnexion
            </Button>
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