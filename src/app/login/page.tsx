"use client";

// login.tsx
import React, { useState } from 'react';
import styles from './login.module.css';
import { post } from '../../lib/api';
import TypewriterText from '../../lib/components/TypewriterText';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await post("/login", { email, password });
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("ログイン成功");
            window.location.href = "/dashboard";
        } else {
            alert("ログイン失敗");
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Log In</h1>
            </TypewriterText>
            <form className={styles.form} onSubmit={handleSubmit}>
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
                <button type="submit" className={styles.button}>
                    Log In
                </button>
            </form>
        </div>
    );
}
