import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button, message, Drawer } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUniversite from '../logo_universite.ico';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const InfluenceurLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const isMobile = window.innerWidth <= 600;

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
      key: '/influenceur/prospects-stats',
      icon: <BarChartOutlined />,
      label: 'Stats Prospects',
    },
    {
      key: '/influenceur/remises',
      icon: <DollarOutlined />,
      label: 'Mes Primes',
    },
    {
      key: '/influenceur/remises/statistiques',
      icon: <BarChartOutlined />,
      label: 'Stats Primes',
    },
  ];

  const userMenuItems = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/influenceur/compte')}>
        Mon Compte
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={async () => {
        await logout();
        navigate('/login-choice');
      }}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (user && user.nom) {
      const names = user.nom.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.nom.substring(0, 2).toUpperCase();
    }
    return 'P'; // Partenaire
  };

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = () => {
    if (!user) return 'Partenaire';
    
    // Si l'utilisateur a un nom, l'utiliser
    if (user.nom) return user.nom;
    
    // Sinon utiliser l'email ou un nom par défaut
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Partenaire';
  };

  // Fonction pour partager le lien d'affiliation
  const handleShareLink = () => {
    if (user && user.code_affiliation) {
      const link = `${window.location.origin}/affiliation/${user.code_affiliation}`;
      navigator.clipboard.writeText(link).then(() => {
        message.success('Lien copié dans le presse-papiers !');
      }).catch(() => {
        message.error('Erreur lors de la copie du lien');
      });
    } else {
      message.error('Code d\'affiliation non disponible');
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <Drawer
          title={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Espace Partenaire</span>}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => { handleMenuClick({ key }); setDrawerVisible(false); }}
            style={{ borderRight: 0 }}
          />
        </Drawer>
      ) : (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <img src={logoUniversite} alt="Logo ISPATEC" style={{ width: 40, height: 40, marginRight: 8, borderRadius: 8 }} />
            <h2 style={{ margin: 0, color: '#1890ff', display: 'inline-block', verticalAlign: 'middle' }}>Affiliation</h2>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text strong style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)' }}>Espace Partenaire</Text>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              size="middle"
              style={{
                marginLeft: 8,
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                fontWeight: 500,
                borderRadius: 6,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                height: 36
              }}
              onClick={handleShareLink}
            >
              Partager mon lien
            </Button>
          </div>
          <Dropdown overlay={userMenuItems} trigger={['click']}>
            <a onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px' }}>
              <Avatar 
                style={{ 
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                {getInitials()}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}>
                 <Text strong style={{ fontSize: '14px', lineHeight: '1.2' }}>
                   {getDisplayName()}
                 </Text>
                 <Text className="mobile-hide" type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                   Partenaire
                 </Text>
               </div>
            </a>
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