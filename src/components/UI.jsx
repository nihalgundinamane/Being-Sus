import React from 'react';
import styles from './UI.module.css';

export function Button({ children, variant = 'primary', onClick, disabled, fullWidth, small, className = '' }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${fullWidth ? styles.fullWidth : ''} ${small ? styles.small : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '', glow }) {
  return (
    <div className={`${styles.card} ${glow ? styles[`glow_${glow}`] : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Stepper({ value, min, max, onChange, label }) {
  return (
    <div className={styles.stepper}>
      <span className={styles.stepperLabel}>{label}</span>
      <div className={styles.stepperControls}>
        <button
          className={styles.stepBtn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease"
        >−</button>
        <span className={styles.stepValue}>{value}</span>
        <button
          className={styles.stepBtn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase"
        >+</button>
      </div>
    </div>
  );
}

export function DifficultyPicker({ value, onChange }) {
  const options = [
    { key: 'easy', label: 'Easy', color: '#00e5b4' },
    { key: 'medium', label: 'Medium', color: '#ffe033' },
    { key: 'hard', label: 'Hard', color: '#ff3c6e' },
  ];
  return (
    <div className={styles.diffRow}>
      {options.map(o => (
        <button
          key={o.key}
          className={`${styles.diffBtn} ${value === o.key ? styles.diffActive : ''}`}
          style={value === o.key ? { borderColor: o.color, color: o.color } : {}}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SectionLabel({ children }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

export function Divider() {
  return <div className={styles.divider} />;
}
