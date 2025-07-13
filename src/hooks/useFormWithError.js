import { useState, useCallback } from 'react';
import { Form } from 'antd';

export const useFormWithError = (formName) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (submitFunction, values) => {
    setLoading(true);
    setError('');

    try {
      const result = await submitFunction(values);
      
      if (result.success) {
        return { success: true, data: result };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`${formName} error:`, error);
      const errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [formName]);

  const handleFormChange = useCallback(() => {
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (error) {
      setError('');
    }
  }, [error]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const resetForm = useCallback(() => {
    form.resetFields();
    setError('');
  }, [form]);

  return {
    form,
    loading,
    error,
    setError,
    handleSubmit,
    handleFormChange,
    clearError,
    resetForm
  };
}; 