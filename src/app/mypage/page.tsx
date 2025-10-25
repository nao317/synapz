"use client";

import Image from "next/image";
import styles from "./mypage.module.css";
import Header from "../../lib/components/Header";
import { Button } from "../../lib/components/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import PostCard from "../../lib/components/PostCard"; // PostCardをインポート
import { Post } from "../../lib/types";

type UserType = {
  name: string;
  email: string;
  profile: string;
  avatar_url: string;
};

export default function MyPage() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); // 投稿用のstateを追加
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar_preview, setAvatar_preview] = useState("/defaultIcon.png");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!authUser) {
          router.push("/login");
          return;
        }

        // ユーザープロフィールの取得
        const userResponse = await fetch(`/api/users/${authUser.id}`, { cache: "no-store" });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch profile");
        }
        const userData: UserType = await userResponse.json();
        setUser(userData);
        setUsername(userData.name || "");
        setProfile(userData.profile || "");
        setAvatar_preview(userData.avatar_url || "/defaultIcon.png");

        // ユーザーの投稿を取得
        const postsResponse = await fetch(`/api/users/${authUser.id}/posts`, { cache: "no-store" });
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData: Post[] = await postsResponse.json();
        setPosts(postsData);

      } catch (e) {
        console.error("Profile or posts fetch error:", e);
        setError("ユーザー情報または投稿の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [router, supabase.auth]);

  const handler_avatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > 500_000) {
      setError("画像サイズは500KB以下にしてください。");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar_preview(previewUrl);
    setAvatarFile(file);
    setError("");
  };

  const handler_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("まだ認証されていません。");

      const formData = new FormData();
      formData.append("name", username || "");
      formData.append("profile", profile);

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const filePath = `avatars/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, avatarFile, { contentType: avatarFile.type, upsert: true });
        if (uploadError) throw uploadError;

        const publicUrl =
          supabase.storage.from("images").getPublicUrl(filePath).data.publicUrl;
        formData.append("avatar_url", publicUrl);
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("プロフィールの更新に失敗しました。");

      const data = await response.json();
      const updated = data.user ?? data;

      setUser(updated);
      setUsername(updated.name || "");
      setProfile(updated.profile || "");
      if (updated.avatar_url) {
        setAvatar_preview(`${updated.avatar_url}?t=${Date.now()}`);
      } else {
        setAvatar_preview("/defaultIcon.png");
      }
      setAvatarFile(null);
      setEditing(false);
    } catch (e) {
      console.error("Update error:", e);
      setError(
        e instanceof Error ? e.message : "プロフィールの更新に失敗しました。"
      );
    }
  };

  if (!mounted || loading)
    return <div className="text-gray-400">読み込み中...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!user) return null;

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <Image
              src={avatar_preview}
              alt="ユーザーのプロフィール画像"
              width={100}
              height={100}
              className={styles.profileIcon}
            />
            <div className={styles.profileInfo}>
              <div className={styles.username}>{user.name || "Unknown"}</div>
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handler_avatarChange}
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
        {/* 投稿一覧の表示 */}
        <div className={styles.postsSection}>
          <h2>あなたの投稿</h2>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>まだ投稿がありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}