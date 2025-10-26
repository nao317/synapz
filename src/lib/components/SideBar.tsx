'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Home, Bell, User, PenSquare, LogOut, Search } from 'lucide-react';
import styles from './SideBar.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter();
    const [userName, setUserName] = useState('ゲスト');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (!isOpen) return;

        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    const response = await fetch(`/api/users/${user.id}`, {
                        cache: 'no-store'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserName(data.name || 'ユーザー');
                        setAvatarUrl(data.avatar_url || null);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [isOpen, supabase.auth]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        className={styles.overlay}
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                    <motion.aside
                        className={styles.sidebar}
                        initial={{ x: '-100%' }}
                        animate={{ x: 10 }}
                        exit={{ x: '-100%' }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 120, 
                            damping: 15,
                            duration: 0.4
                        }}
                    >
                        <button className={styles.backBtn} onClick={onClose}>
                            <ChevronLeft size={24} />
                        </button>

                        {/* ユーザー情報セクション */}
                        <div className={styles.userSection}>
                            <div className={styles.userHeader}>
                            <div className={styles.avatar}>
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="avatar" width={26} height={26} />
                                ) : (
                                    <User size={26} />
                                )}
                            </div>
                            <div className={styles.userName}>{userName}</div>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>フォロー</span>
                                    <span className={styles.statNumber}>0</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>フォロワー</span>
                                    <span className={styles.statNumber}>0</span>
                                </div>
                            </div>
                        </div>

                        <h2 className={styles.title}>Menu</h2>

                        <nav className={styles.nav}>
                            <Link href="/dashboard"><Home /> ホーム</Link>
                            <Link href="/post"><PenSquare /> 投稿</Link>
                            <Link href="/notifications"><Bell /> 通知</Link>
                            <Link href="/mypage"><User /> マイページ</Link>
                            <Link href="/search"><Search />検索</Link>
                        </nav>

                        <button className={styles.logout} onClick={() => router.push('/')}>
                            <LogOut /> ログアウト
                        </button>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
