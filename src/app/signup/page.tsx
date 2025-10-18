"use client";

// signup.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './signup.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
import { getSupabaseClient } from '@/lib/supabaseClient';
export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const supabase = getSupabaseClient();
        if (!supabase) {
            setError('Supabaseクライアントが初期化されていません');
            return;
        }

        if (password !== confirmpassword) {
            setError("パスワードが一致しません");
            return;
        }

        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }, // ← Supabaseユーザーにカスタムデータとして登録できる
            },
        });

        setLoading(false);

        if (error) {
            console.error(error);
            setError("登録失敗: " + error.message);
        } else {
            alert("アカウントが登録されました！　メールから認証を完了してください！");
            window.location.href = "/login";
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Sign Up</h1>
            </TypewriterText>
            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="name"
                    placeholder="Username"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className={styles.input}
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "登録中..." : "新規登録"}
                </button>
                <Link href="/login" className={styles.link}>すでにアカウントを持っている</Link>
            </form>
        </div>
    );
}
