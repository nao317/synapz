'use client';

import React from 'react';
import styles from './dashboard.module.css';
import Header from '@/lib/components/Header';
export default function Dashboard({ children }: { children?: React.ReactNode }) {
    return (
        <div className={styles.dashboard}>
            <Header />
            {children}
        </div>
    );
}