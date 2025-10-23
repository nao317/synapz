import React from 'react';
import styles from './Input.module.css';


type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string; 
};

export const Input: React.FC<InputProps> = ({
     label,
     ...props 
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={styles.input} {...props} />
    </div>
  );
};
