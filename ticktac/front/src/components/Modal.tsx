import React from 'react';
import styles from '../styles/Modal.module.css';

export default function Modal({ children, onClose }:
  { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
