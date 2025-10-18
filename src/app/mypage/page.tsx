"use client";

// mypage.tsx
import React, { useState } from 'react';
import styles from './mypage.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
import Header from '../../lib/components/Header';

export default function MyPage() {
 return (
    <div className={styles.container}>
        <Header></Header>

        <TypewriterText>
        <h1 className={styles.title}>My Page</h1>
        </TypewriterText>

         <div className={styles.profileCard}>
         <div className={styles.username}>ユーザー名</div>
         <div className={styles.email}>email@example.com</div>
          <div className={styles.profileStats}>
          <span>フォロー: 123</span>
          <span>フォロワー: 456</span>
          <span>ブックマーク: 78</span>
         </div>
         <button className={styles.button}>編集</button>      
         </div>
          <div className={styles.postsContainer}>
  <div className={styles.postCard}>
    <h3>投稿タイトル</h3>
    <p>投稿の本文</p>
    <div className={styles.postDate}>2025/10/18</div>
  </div>
  <div className={styles.postCard}>
    <h3>別の投稿</h3>
    <p>本文...</p>
    <div className={styles.postDate}>2025/10/17</div>
  </div>
</div>

    </div>
  );
}