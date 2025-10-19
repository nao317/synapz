"use client";

// search.tsx
import React, { useState } from 'react';
import styles from './search.module.css';
import Header from '../../lib/components/Header';
import TypewriterText from '../../lib/components/TypewriterText';
import { Button } from '../../lib/components/Button';
import PostCard from '@/lib/components/PostCard';

export default function SearchPage() {
    return (
    <div className={styles.dashboard}>
    <Header>
    </Header>

    <div className={styles.container}>
<div className={styles.searchContainer}>
  <input
    type="text"
    placeholder="検索..."
    className={styles.searchInput}
  />
  <Button>検索</Button>

</div>
　　　　　<PostCard
          userIconUrl={null} // または "/profile-icon.png"
          username="テストユーザー"
          content="テスト"
        />
</div>
</div>
    );
}