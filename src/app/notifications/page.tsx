'use client';

import React, { useState } from 'react';
import styles from './notifications.module.css';
import Header from '../../lib/components/Header';

type Notification = {
    type: 'like' | 'follow' | 'comment';
    text: string;
};

export default function Notifications() {
    const [activeTab, setActiveTab] = useState<'like' | 'follow' | 'comment'>('like');
    const [notifications, setNotifications] = useState<Notification[]>([
        { type: 'like', text: 'ユーザーAがあなたの投稿にいいねしました' },
        { type: 'follow', text: 'ユーザーBがあなたをフォローしました' },
        { type: 'comment', text: 'ユーザーCがコメントしました' },
        { type: 'like', text: 'ユーザーDがあなたの投稿にいいねしました' },
    ]);

    return (
        <div className={styles.notificationsPage}>
            {/* Header 固定 */}
            <div className={styles.headerWrapper}>
                <Header />
            </div>

            <main className={styles.main}>
                <h1 className={styles.title}>Notifications</h1>

                {/* タブバー（上部固定） */}
                <div className={styles.tabBar}>
                    <button
                        className={activeTab === 'like' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('like')}
                    >
                        いいね
                    </button>
                    <button
                        className={activeTab === 'follow' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('follow')}
                    >
                        フォロー
                    </button>
                    <button
                        className={activeTab === 'comment' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('comment')}
                    >
                        コメント
                    </button>
                </div>

                {/* 通知リスト */}
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
