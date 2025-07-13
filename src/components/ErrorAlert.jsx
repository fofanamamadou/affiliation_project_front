import React from 'react';
import { Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const ErrorAlert = ({ 
  error, 
  onClose, 
  title = "Erreur", 
  style = {}, 
  closable = true,
  showIcon = true 
}) => {
  if (!error) return null;

  return (
    <Alert
      message={title}
      description={error}
      type="error"
      showIcon={showIcon}
      closable={closable}
      onClose={onClose}
      style={{ 
        marginBottom: '24px',
        ...style
      }}
      closeIcon={<CloseOutlined />}
    />
  );
};

export default ErrorAlert; 