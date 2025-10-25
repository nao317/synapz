'use client';

import React from 'react';
import Dashboard from './dashboard';
import TimeLine from '@/lib/components/TimeLine';

export default function DashboardPage() {
    return (
        <Dashboard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <TimeLine />
            </div>
        </Dashboard>
    )
}