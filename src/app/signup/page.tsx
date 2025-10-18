"use client";

// login.tsx
import React, { useState } from 'react';
import styles from './signup.module.css';
import { post } from '../../lib/api';
import TypewriterText from '../../lib/components/TypewriterText';
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert("パスワードが一致しません");
            return;
        }
        const data = await post("/signup", { username, email, password });
        if (data.message) {
            alert("サインアップ成功");
            window.location.href = "/login";
        } else {
            alert("サインアップ失敗");
        }
    };

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Sign In</h1>
            </TypewriterText>
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
                <button type="submit" className={styles.button}>
                    Sign In
                </button>
            </form>
        </div>
    );
}
