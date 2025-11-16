// Validation utilities for forms and data
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || !value.trim()) {
    return `${fieldName} est requis`;
  }
  return undefined;
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | undefined => {
  if (value.length < min) {
    return `${fieldName} doit contenir au moins ${min} caractères`;
  }
  if (value.length > max) {
    return `${fieldName} ne peut pas dépasser ${max} caractères`;
  }
  return undefined;
};