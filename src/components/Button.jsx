import React from 'react';
import { Button as AntButton } from 'antd';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'middle', 
  loading = false,
  className = '',
  ...props 
}) => {
  const typeMap = {
    primary: 'primary',
    secondary: 'default',
    success: 'primary',
    danger: 'primary',
    warning: 'primary',
    outline: 'default'
  };

  const colorMap = {
    success: '#52c41a',
    danger: '#ff4d4f',
    warning: '#faad14'
  };

  const style = colorMap[variant] ? { backgroundColor: colorMap[variant], borderColor: colorMap[variant] } : {};

  return (
    <AntButton
      type={typeMap[variant] || 'primary'}
      size={size}
      loading={loading}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button; 