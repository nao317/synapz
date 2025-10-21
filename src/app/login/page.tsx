"use client";

// login.tsx

// 入力された情報の保持
import { useState } from 'react';

// ルーティング
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// CSS
import styles from './login.module.css';

// animation - react motion
import TypewriterText from '../../lib/components/TypewriterText';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // api/login
        const response = await fetch('/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            router.push('/dashboard');
            router.refresh();
        } else {
            const data = await response.json();
            setError(data.error || 'ログインに失敗');
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Log In</h1>
            </TypewriterText>
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
                <button type="submit" className={styles.button}>ログイン</button>
                <Link href="/signup" className={styles.link}>まだアカウントを持っていない</Link>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
