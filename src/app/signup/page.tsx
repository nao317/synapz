'use client';

// useState, useEffect
import React, { useState } from 'react';

// frontend component
import styles from './signup.module.css';
import TypewriterText from '../../lib/components/TypewriterText';

// Routing
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// SignupPage() function
export default function SignupPage() {
    const [username, setUsername] = useState(''); // username keep
    const [email, setEmail] = useState(''); // for emailaddress
    const [password, setPassword] = useState(''); // for password
    const [confirmpassword, setConfirmpassword] = useState(''); // confirm with upon address
    const [error, setError] = useState(''); // error info
    
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // GET
        const response = await fetch('/api/Auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        // パスワードの確認
        if (password !== confirmpassword) {
            setError("パスワードが一致しません");
            return;
        }

        if (response.ok) {
            // サインアップ後、ログインページに遷移
            alert('サインアップできました。ログインページからログインしてください。');
            router.push('/login');
        } else {
            const data = await response.json();
            setError(data.error || 'サインアップに失敗しました');
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Sign Up</h1>
            </TypewriterText>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
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
                <button type="submit" className={styles.button}>
                    サインアップ
                </button>
                <Link href="/login" className={styles.link}>
                    すでにアカウントを持っている
                </Link>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
