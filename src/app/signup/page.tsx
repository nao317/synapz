"use client";

// login.tsx
import React, { useState } from 'react';
import styles from './signup.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');

    return (
        <div className={styles.container}>
            <TypewriterText>
                <h1 className={styles.title}>Sign Up</h1>
            </TypewriterText>
            <form className={styles.form}>
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
                    Sign Up
                </button>
            </form>
        </div>
    );
}
