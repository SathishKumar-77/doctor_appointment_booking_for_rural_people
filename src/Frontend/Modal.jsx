import React, { useState } from 'react';
import '../style/Modal.css';

const Modal = ({ isOpen, onClose, children, title, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="modal-btn submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '150px' }}
          >
            {loading ? <div className="spinner"></div> : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;