// hooks/useAdvancedForm.ts
import { useState, useCallback } from 'react';
import { Form, message } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface UseAdvancedFormProps {
  defaultValues?: Record<string, any>;
  onSuccess?: (values: any) => void;
  onError?: (error: any) => void;
}

export const useAdvancedForm = ({
  defaultValues,
  onSuccess,
  onError,
}: UseAdvancedFormProps = {}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    form.resetFields();
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, [form, defaultValues]);

  const setFormValues = useCallback((values: Record<string, any>) => {
    form.setFieldsValue(values);
  }, [form]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      return false;
    }
  }, [form]);

  const submitForm = useCallback(async (onSubmit: (values: any) => Promise<void>) => {
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      onSuccess?.(values);
      message.success('Operation completed successfully');
    } catch (error) {
      onError?.(error);
      message.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  }, [form, onSuccess, onError]);

  return {
    form,
    loading,
    submitting,
    resetForm,
    setFormValues,
    validateForm,
    submitForm,
    formInstance: form as FormInstance,
  };
};