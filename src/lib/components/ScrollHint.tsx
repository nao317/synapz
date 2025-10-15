'use client';
import React from 'react';
import styles from './ScrollHint.module.css';

export default function ScrollHint() {
    const handleClick = () => {
        window.scrollTo({
            top: window.innerHeight, // 1画面分スクロール
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles.container} onClick={handleClick}>
            <div className={styles.content}>
                <p className={styles.message}>Learn More</p>
                <div className={styles.arrows}>
                    <div className={styles.arrow}></div>
                    <div className={styles.arrow}></div>
                </div>
            </div>
        </div>
    );
}
