'use client';

import React, { useState } from 'react';
import styles from './notifications.module.css';
import Header from '../../lib/components/Header';
import SideBar from '../../lib/components/SideBar';

type Notification = {
    type: 'like' | 'follow' | 'comment';
    text: string;
};

const notifications: Notification[] = [
    { type: 'like', text: 'ユーザーAがあなたの投稿にいいねしました' },
];


export default function Notifications() {
    const [activeTab, setActiveTab] = useState<'like' | 'follow' | 'comment'>('like');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.notificationsPage}>
            <div className={styles.headerWrapper}>
                <Header />
            </div>

            <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


            <main className={styles.main}>
                <h1 className={styles.title}>Notifications</h1>

                <div className={styles.tabBar}>
                    {['like', 'follow', 'comment'].map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? styles.activeTab : ''}
                            onClick={() => setActiveTab(tab as 'like' | 'follow' | 'comment')}
                        >
                            {tab === 'like' ? 'いいね' : tab === 'follow' ? 'フォロー' : 'コメント'}
                        </button>
                    ))}
                </div>


                <ul className={styles.list}>
                    {notifications
                        .filter((note) => note.type === activeTab)
                        .map((note, index) => (
                            <li key={index} className={styles.item}>
                                {note.text}
                            </li>
                        ))}
                </ul>
            </main>
        </div>
    );
}
