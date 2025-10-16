"use client";

// login.tsx
import React, { useState } from 'react';
import styles from './signup.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>SignUp</h1>
            <form className={styles.form}>
              <span>email</span>
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <span>password</span>
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>password confirmation</span>
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className={styles.button}>
                    Sign In
                </button>
            </form>
        </div>
    );
}
