// Toast.jsx
import React, { useState, useEffect } from 'react';
import './Toast.css';

export const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  const handleClose = () => {
    setVisible(false);
    // Give time for exit animation before removing
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!visible) return null;
  
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
        {type === 'error' && <i className="fas fa-times-circle"></i>}
      </div>
      <div className="toast-content">
        {message}
      </div>
      <button className="toast-close" onClick={handleClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

// ToastContainer.jsx
// import React, { useState } from 'react';
// import Toast from './Toast';

 const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      {/* Example usage buttons */}
      <div className="toast-demo-buttons">
        <button className="btn-success" onClick={() => addToast('Operation completed successfully!', 'success')}>
          Show Success Toast
        </button>
        <button className="btn-warning" onClick={() => addToast('This action requires your attention', 'warning')}>
          Show Warning Toast
        </button>
        <button className="btn-error" onClick={() => addToast('An unexpected error occurred', 'error')}>
          Show Error Toast
        </button>
      </div>
    </div>
  );
};

export default ToastContainer;