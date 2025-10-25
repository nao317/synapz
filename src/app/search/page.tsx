"use client";

// search.tsx
import styles from './search.module.css';
import Header from '../../lib/components/Header';
import { Button } from '../../lib/components/Button';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className={styles.dashboard}>
      <Header>
      </Header>

      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="検索..."
            className={styles.searchInput}
          />
          </div>
          <Button>検索</Button>
        </div>
      </div>
    </div>
  );
}