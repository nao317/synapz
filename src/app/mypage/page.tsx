"use client";

// mypage.tsx
import Image from 'next/image';
import styles from './mypage.module.css';
import Header from '../../lib/components/Header';
import { Button } from '../../lib/components/Button';
import { useRouter } from 'next/navigation';
import PostCard from '@/lib/components/PostCard';

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
         <PostCard
  postId="1"
  userIconUrl="/user1.png"
  username="テストユーザー"
  content="テスト"
  initialIsLiked={false}
  initialLikeCount={0}
/>

<PostCard
  postId="2"
  userIconUrl="/user1.png"
  username="テストユーザー"
  content="テスト"
  initialIsLiked={false}
  initialLikeCount={0}
/>
        </div>
      </div>
    </div>
  );
}