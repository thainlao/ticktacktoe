import React from 'react';
import styles from '../styles/Square.module.css';

export default function Square({ value, onClick }:
  { value: 'X' | 'O' | null, onClick: () => void }) {
  return (
    <button className={styles.square} onClick={onClick}>
      <span className={value === 'X' ? styles.x : styles.o}>{value}</span>
    </button>
  );
}
