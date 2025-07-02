import React, { createContext, useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
`;

const ToastItem = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-lg);
  animation: slideInRight 0.3s ease-out;
  
  &.success {
    border-left: 4px solid var(--success-color);
  }
  
  &.error {
    border-left: 4px solid var(--error-color);
  }
  
  &.warning {
    border-left: 4px solid var(--warning-color);
  }
  
  &.info {
    border-left: 4px solid var(--accent-secondary);
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.success { color: var(--success-color); }
  &.error { color: var(--error-color); }
  &.warning { color: var(--warning-color); }
  &.info { color: var(--accent-secondary); }
`;

const ToastContent = styled.div`
  flex: 1;
  
  .toast-title {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }
  
  .toast-message {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
  }
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
      return <Info size={20} />;
    default:
      return <Info size={20} />;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    return addToast({ type: 'error', title, message, duration: 7000 });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((message, title = 'Info') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const value = {
    success,
    error,
    warning,
    info,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem key={toast.id} className={toast.type}>
            <ToastIcon className={toast.type}>
              {getIcon(toast.type)}
            </ToastIcon>
            <ToastContent>
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <p className="toast-message">{toast.message}</p>
            </ToastContent>
            <ToastClose onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </ToastClose>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};