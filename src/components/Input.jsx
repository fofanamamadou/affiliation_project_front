import React from 'react';
import { Input as AntInput } from 'antd';

const Input = ({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <AntInput
        status={error ? 'error' : ''}
        {...props}
      />
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
      {helperText && !error && (
        <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input; 