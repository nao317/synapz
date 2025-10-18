"use client";

// login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { supabase } from '@/lib/supabaseClient';
import TypewriterText from '../../lib/components/TypewriterText';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    {loading ? "ログイン中..." : "Log In"}
                </button>
            </form>
        </div>
    );
}
