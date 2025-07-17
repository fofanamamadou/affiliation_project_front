import React from 'react';
import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        padding: 'clamp(16px, 5vw, 48px)',
      }}
    >
      <Result
        status="404"
        title={<span style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)' }}>404</span>}
        subTitle={
          <Paragraph style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', margin: 0 }}>
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.<br />
            <span style={{ color: '#1890ff' }}>Plateforme d'affiliation ISPATEC</span>
          </Paragraph>
        }
        extra={
          <Button
            type="primary"
            size="large"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', borderRadius: 8 }}
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        }
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: 'clamp(24px, 6vw, 48px)',
          width: '100%',
          maxWidth: 480,
        }}
      />
    </div>
  );
} 