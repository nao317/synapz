'use client';

import React, { useState } from 'react';
import styles from './notifications.module.css';
import Header from '../../lib/components/Header';

export default function Notifications() {
    const [notifications, setNotifications] = useState<string[]>([]);

    return (
        <div className={styles.notificationsPage}>
            {/* Header を最上部に固定 */}
            <div className={styles.headerWrapper}>
                <Header />
            </div>

            {/* コンテンツ領域 */}
            <main className={styles.main}>
                <h1 className={styles.title}>Notifications</h1>

                <ul className={styles.list}>
                    {notifications.map((note, index) => (
                        <li key={index} className={styles.item}>
                            {note}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
