"use client";

// mypage.tsx

// UI components
import Image from 'next/image';
import styles from './mypage.module.css';
import Header from '../../lib/components/Header';
import { Button } from '../../lib/components/Button';

// Routing
import { useRouter } from 'next/navigation';

// react系のライブラリ useEffectとか
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from 'lucide-react';

type User = {
  name: string;
  email: string;
  profile: string;
  avatar_url: string;
}

export default function MyPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatar_preview, setAvatar_preview] = useState('');

  // useEffect()
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {

        // ログインしているかどうかを確認
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          router.push('/login');
          return;
        }
        const userId = user.id;
        const response = await fetch(`/api/users/${userId}`, { cache: 'no-store' });
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(`Failed to fetch profile: ${response.status} ${text}`);
        }

        const data: User = await response.json();

        setUser(data);
        setUsername(data.name || '');
        setProfile(data.profile || '');
        setAvatar_preview(data.avatar_url || '');
      } catch (e) {
        console.error('Profile fetch error:', e);
        setError('ユーザープロフィールの取得に失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase.auth]);

  const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = (e) => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }


          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handler_avatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > 500_000) {
      setError('画像サイズは500KB以下に圧縮してください');
      e.target.value = '';
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setAvatar_preview(previewUrl);

      const compressedBase64 = await compressImage(file, 256, 256, 0.8);
      setAvatar(compressedBase64);
      setError('');
    } catch (err) {
      console.error('Image compression error:', err);
      setError('画像の設定に失敗しました');
    }
  };

  const handler_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('まだ認証されていません。');

      const formData = new FormData();
      formData.append('name', username || '');
      formData.append('profile', profile);
      if (avatar) formData.append('avatar', avatar);

      const userId = user.id;
      const response = await fetch(`/api/users/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`プロフィールの更新に失敗: ${response.status} ${text}`);
      }

      // ここを修正：レスポンス全体を確認
      const data = await response.json();
      const updatedData: User = data.user ?? data; // user がなければ data を直接使う

      setUser(updatedData);
      setUsername(updatedData.name || '');
      setProfile(updatedData.profile || '');
      setAvatar_preview(updatedData.avatar_url || '');
      setAvatar(null);
      setEditing(false);
    } catch (e) {
      console.error('Update error:', e);
      setError(e instanceof Error ? e.message : 'プロフィールの更新に失敗しました');
    }
  };


  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
        <div
          className="relative h-12 w-12 animate-spin rounded-full border-4 border-transparent"
          style={{
            borderTopColor: '#00ffff',
            boxShadow: '0 0 15px #00ffff, 0 0 30px #0088ff, 0 0 45px #0044ff',
          }}
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
        <div
          className="max-w-md mx-auto p-6 rounded-2xl text-center text-red-400 font-semibold tracking-wide"
          style={{
            background: 'rgba(30, 0, 0, 0.4)',
            border: '1px solid rgba(255, 0, 80, 0.4)',
            boxShadow:
              '0 0 10px rgba(255, 0, 80, 0.6), 0 0 20px rgba(255, 0, 80, 0.4), inset 0 0 10px rgba(255, 0, 80, 0.2)',
            textShadow: '0 0 8px rgba(255, 0, 100, 0.6)',
          }}
        >
          {error}
        </div>
      </div>
    );
  }


  if (!user) return null;


  return (
    <div className={styles.dashboard}>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <Image
              src={avatar_preview || '/profile-icon.png'}
              alt="ユーザーのプロフィール画像"
              width={100}
              height={100}
              className={styles.profileIcon}
            />
            <div className={styles.profileInfo}>
              <div className={styles.username}>{user.name || 'Unknown'}</div>
              <div className={styles.email}>{user.email}</div>
              <div className={styles.plofileBio}>{user.profile}</div>

              <div className={styles.profileStats}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>フォロー</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>フォロワー</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>ブックマーク</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>投稿</div>
                </div>
              </div>
              {!editing && (
                <Button
                  onClick={() => {
                    setEditing(true);
                    setUsername(user.name);
                    setProfile(user.profile);
                    setAvatar(null);
                  }}>
                  編集
                </Button>
              )}
              {editing && (
                <form onSubmit={handler_submit} className={styles.editForm}>
                  <label className={styles.editLabel}>ユーザー名</label>
                  <input
                    type="text"
                    value={username ?? ''}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.editInput}
                  />

                  <label className={styles.editLabel}>自己紹介</label>
                  <textarea
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className={styles.editTextarea}
                  />

                  <div className={styles.editButtons}>
                    <Button type="submit">保存</Button>
                    <Button onClick={() => setEditing(false)}>キャンセル</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className={styles.postsContainer}>
          <h2 className={styles.sectionTitle}>あなたの投稿</h2>
        </div>
      </div>
    </div>
  );
}