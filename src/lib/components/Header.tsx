'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu, Home, Bell, User } from 'lucide-react';
import SideBar from '@/lib/components/SideBar';

export default function Header() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* スライドサイドバー */}
            <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <header className={styles.header}>
                {/* モバイル用メニューアイコン */}
                <button
                    className={styles.menuButton}
                    onClick={() => setIsOpen(true)}
                >
                    <Menu size={28} />
                </button>
                <div className={styles.logo} onClick={() => router.push('/')}>
                    <span className={styles.logoText}>Synapz</span>
                </div>

                {/* PC用ナビゲーション */}
                <nav className={styles.nav}>
                    <Link href='/dashboard'><Home /></Link>
                    <Link href='/mypage'><User /></Link>
                    <Link href='/notifications'><Bell /></Link>
                </nav>
            </header>
        </>
    );
}
