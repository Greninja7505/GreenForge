// Form validation utilities

export const validators = {
  required: (value, fieldName = "This field") => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  minLength: (value, min, fieldName = "This field") => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = "This field") => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  },

  match: (value, matchValue, fieldName = "Fields") => {
    if (value !== matchValue) {
      return `${fieldName} do not match`;
    }
    return null;
  },

  stellarAddress: (value) => {
    if (!value) return null;
    if (!value.startsWith("G") || value.length !== 56) {
      return "Please enter a valid Stellar address";
    }
    return null;
  },

  number: (value, fieldName = "This field") => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  positiveNumber: (value, fieldName = "This field") => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  },

  password: (value) => {
    if (!value) return null;
    const errors = [];
    if (value.length < 8) {
      errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("one number");
    }
    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}`;
    }
    return null;
  },
};

// Validate a single field with multiple validators
export const validateField = (value, validatorFns) => {
  for (const validatorFn of validatorFns) {
    const error = validatorFn(value);
    if (error) return error;
  }
  return null;
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const error = validateField(formData[fieldName], rules);
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { errors, isValid };
};

// Hook for form validation state
import { useState, useCallback } from "react";

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setValues((prev) => ({ ...prev, [name]: newValue }));
    
    // Validate on change if field was touched
    if (touched[name] && validationRules[name]) {
      const error = validateField(newValue, validationRules[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touched, validationRules]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate on blur
    if (validationRules[name]) {
      const error = validateField(value, validationRules[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validationRules]);

  const validate = useCallback(() => {
    const { errors: newErrors, isValid } = validateForm(values, validationRules);
    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
  };
};

// ============================================
// XSS Protection & Sanitization
// ============================================

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=/]/g, (char) => map[char]);
};

/**
 * Sanitize HTML content - removes dangerous tags
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  html = html.replace(/javascript:/gi, '');
  return html;
};

/**
 * Sanitize object - recursively sanitize all string values
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[sanitizeString(key)] = sanitizeObject(value);
  }
  return sanitized;
};

// ============================================
// Rate Limiting (Client-side)
// ============================================

class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    if (this.requests.length >= this.maxRequests) return false;
    this.requests.push(now);
    return true;
  }
  
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

export const apiRateLimiter = new RateLimiter(100, 60000);

export const checkRateLimit = () => {
  if (!apiRateLimiter.canMakeRequest()) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  return true;
};

// ============================================
// Campaign Form Validation
// ============================================

export const validateCampaignForm = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) errors.title = 'Title is required';
  else if (data.title.length < 5) errors.title = 'Title must be at least 5 characters';
  
  if (!data.description?.trim()) errors.description = 'Description is required';
  else if (data.description.length < 50) errors.description = 'Description must be at least 50 characters';
  
  if (!data.goalAmount || data.goalAmount < 10) errors.goalAmount = 'Goal must be at least 10 XLM';
  
  if (!data.milestones || data.milestones.length === 0) {
    errors.milestones = 'At least one milestone is required';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateDonationForm = (data) => {
  const errors = {};
  if (!data.amount || data.amount < 1) errors.amount = 'Minimum donation is 1 XLM';
  if (data.amount > 1000000) errors.amount = 'Maximum donation is 1,000,000 XLM';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export default validators;
