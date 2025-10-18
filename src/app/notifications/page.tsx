"use client";

// notifications.tsx
import React, { useState } from 'react';
import styles from './notifications.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
export default function notifications() {
    const [notifications, setNotifications] = useState<string[]>([]);//複数の通知をリストで表示
    //const [newNotification, setNewNotification] = useState('');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Notifications</h1>
            <ul className={styles.list}>
                {notifications.map((note, index) => (
                    <li key={index} className={styles.item}>
                        {note}
                    </li>
                ))}
            </ul>
        </div>
    );
}
