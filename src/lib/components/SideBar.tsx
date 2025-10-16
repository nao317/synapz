'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, Home, Bell, User, PenSquare, LogOut } from 'lucide-react';
import styles from './SideBar.module.css';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter();

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
                    {/* ← 閉じるボタン */}
                    <button className={styles.backBtn} onClick={onClose}>
                        <ChevronLeft size={24} />
                    </button>

                    <h2 className={styles.title}>Menu</h2>

                    <nav className={styles.nav}>
                        <Link href="/dashboard"><Home /> ホーム</Link>
                        <Link href="/post"><PenSquare /> 投稿</Link>
                        <Link href="/notifications"><Bell /> 通知</Link>
                        <Link href="/mypage"><User /> マイページ</Link>
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
