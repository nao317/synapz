"use client";

// mypage.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './mypage.module.css';
import TypewriterText from '../../lib/components/TypewriterText';
import Header from '../../lib/components/Header';
import { Button } from '../../lib/components/Button';
import { useRouter } from 'next/navigation';




export default function MyPage() {
  const router = useRouter();
  const goToEdit = () => {
    router.push('/mypage_edit');
  };
  return (
    <div className={styles.dashboard}>
      <Header>

      </Header>


      <div className={styles.container}>

        <div className={styles.profileSection}>
          <TypewriterText>
            <h1 className={styles.title}>My Page</h1>
          </TypewriterText>

          <div className={styles.profileCard}>
            <Image
              src="/profile-icon.png"
              alt="ユーザーのプロフィール画像"
              width={100}
              height={100}
              className={styles.profileIcon}
            />
            <div className={styles.profileInfo}>
              <div className={styles.username}>ユーザー名</div>
              <div className={styles.email}>email@example.com</div>
              <div className={styles.plofileBio}>プロフィール</div>

              <div className={styles.profileStats}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>123</div>
                  <div className={styles.statLabel}>フォロー</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>456</div>
                  <div className={styles.statLabel}>フォロワー</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>78</div>
                  <div className={styles.statLabel}>ブックマーク</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>5</div>
                  <div className={styles.statLabel}>投稿</div>
                </div>
              </div>

              <Button onClick={goToEdit}>編集</Button>

            </div>
          </div>
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
    </div>
  );
}
