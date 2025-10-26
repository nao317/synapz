'use client';

import React from 'react';
import Dashboard from './dashboard';
import TimeLine from '@/lib/components/TimeLine';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    return (
        <Dashboard>
            <div className={styles.main} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <TimeLine />
            </div>
        </Dashboard>
    )
}