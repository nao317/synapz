"use client";

// mypage.tsx
import React, { useState } from 'react';
import styles from './mypage.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
import Header from '../../lib/components/Header';

export default function MyPage() {
 return (
    <div className={styles.container}>
        <Header>
        </Header>

        <TypewriterText>
        <h1 className={styles.title}>My Page</h1>
        </TypewriterText>

         <div className={styles.profileCard}>
         <div className={styles.username}>ユーザー名</div>
         <div className={styles.email}>email@example.com</div>
         <button className={styles.Button}>編集</button>      
         </div>

    </div>
  );
}