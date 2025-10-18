"use client";

// login.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
import { getSupabaseClient } from '@/lib/supabaseClient';
import  Link  from 'next/link';
import { testSupabaseClientSingleton, checkEnvironmentVariables } from '@/lib/supabaseClientTest';
import { style } from 'framer-motion/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // Development環境でのテスト実行
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Supabaseクライアントのテストを実行中...');
            checkEnvironmentVariables();
            testSupabaseClientSingleton();
        }
    }, []);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const supabase = getSupabaseClient();
        if (!supabase) {
            setError('Supabaseクライアントが初期化されていません');
            return;
        }
        
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            console.error(error);
            setError("ログイン失敗: " + error.message);
        } else if (data?.session) {
            // ログイン成功時にdashboardにリダイレクト
            router.push("/dashboard");
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Log In</h1>
            </TypewriterText>
            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}
            <form className={styles.form} onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
                <Link href="/signup" className={styles.link}>まだアカウントを持っていない</Link>
            </form>
        </div>
    );
}
