"use client";

// UI components
import Image from 'next/image';
import styles from './mypage.module.css';
import Header from '../../lib/components/Header';
import { Button } from '../../lib/components/Button';

// Routing
import { useRouter } from 'next/navigation';

// react系
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type UserType = {
  name: string;
  email: string;
  profile: string;
  avatarurl: string;
};

export default function MyPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<UserType | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar_preview, setAvatar_preview] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/users/${user.id}`, { cache: 'no-store' });
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(`Failed to fetch profile: ${response.status} ${text}`);
        }

        const data: UserType = await response.json();
        setUser(data);
        setUsername(data.name || '');
        setProfile(data.profile || '');
        setAvatar_preview(data.avatarurl || '');
      } catch (e) {
        console.error('Profile fetch error:', e);
        setError('ユーザープロフィールの取得に失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase.auth]);

  // Supabase Storage にアップロード
  const uploadAvatar = async (file: File, userId: string) => {
    const ext = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${ext}`; // バケット内のパス

    // ← バケット名を Images に変更
    const { data, error } = await supabase.storage
      .from('images')   // ここを 'Images' に変更
      .upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath); // ここも
    return urlData.publicUrl;
  };

  const handler_avatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > 500_000) {
      setError('画像サイズは500KB以下にしてください');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar_preview(previewUrl);
    setAvatarFile(file);
    setError('');
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

      // アバターが選択されている場合
      if (avatar_preview) {
        // Blob に変換
        const blob = await fetch(avatar_preview).then(res => res.blob());

        // Storage にアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`avatars/${user.id}.png`, blob, { contentType: blob.type, upsert: true });

        if (uploadError) throw uploadError;

        // 公開 URL を取得して API に送る
        const url = supabase.storage.from('images').getPublicUrl(`avatars/${user.id}.png`).data.publicUrl;
        formData.append('avatar_url', url);
      }

      // API に送信
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('プロフィールの更新に失敗');

      const data = await response.json();
      const updatedData = data.user ?? data;

      setUser(updatedData);
      setUsername(updatedData.name || '');
      setProfile(updatedData.profile || '');
      // UserType に合わせる
      setAvatar_preview(updatedData.avatarurl || updatedData.avatar_url || '');
      setAvatarFile(null);
      setEditing(false);

    } catch (e) {
      console.error('Update error:', e);
      setError(e instanceof Error ? e.message : 'プロフィールの更新に失敗しました');
    }
  };

  if (error) return <div className="text-red-400">{error}</div>;
  if (!user) return null;

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <Image
              src={avatar_preview || '/defaultIcon.png'}
              alt="ユーザーのプロフィール画像"
              width={100}
              height={100}
              className={styles.profileIcon}
            />
            <div className={styles.profileInfo}>
              <div className={styles.username}>{user.name || 'Unknown'}</div>
              <div className={styles.email}>{user.email}</div>
              <div className={styles.plofileBio}>{user.profile}</div>

              {!editing && (
                <Button
                  onClick={() => {
                    setEditing(true);
                    setUsername(user.name);
                    setProfile(user.profile);
                    setAvatarFile(null);
                  }}
                >
                  編集
                </Button>
              )}
              {editing && (
                <form onSubmit={handler_submit} className={styles.editForm}>
                  <label className={styles.editLabel}>ユーザー名</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.editInput}
                  />
                  <label className={styles.editLabel}>自己紹介</label>
                  <textarea
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className={styles.editTextarea}
                  />
                  <label className={styles.editLabel}>プロフィール画像</label>
                  <input type="file" accept="image/*" onChange={handler_avatarChange} />
                  <div className={styles.editButtons}>
                    <Button type="submit">保存</Button>
                    <Button onClick={() => setEditing(false)}>キャンセル</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
