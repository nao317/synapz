"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./edit.module.css";
import Header from "../../lib/components/Header";
import { Button } from "../../lib/components/Button";
import { useRouter } from "next/navigation";

export default function MyPageEdit() {
  // 初期値をフォームにセット
  const [username, setUsername] = useState("ユーザー名");
  const [email, setEmail] = useState("email@example.com");
  const [bio, setBio] = useState("プロフィール");

  const router = useRouter();

  // 🔹 保存処理（保存後にマイページへ戻る）
  const handleSave = async () => {
    try {
      // ここに保存処理を追加（API呼び出しなど）
      console.log("保存データ:", { username, email, bio });

      // 仮の保存完了メッセージ
      alert("プロフィールを保存しました ✅");

      // 保存完了後にマイページへ移動
      router.push("/mypage");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header />

      <div className={styles.container}>
        <div className={styles.profileSection}>
          <h1 className={styles.title}>My Page 編集</h1>

          <div className={styles.profileCard}>
            <Image
              src="/profile-icon.png"
              alt="ユーザーのプロフィール画像"
              width={100}
              height={100}
              className={styles.profileIcon}
            />

            <div className={styles.profileInfo}>
              <label className={styles.label}>ユーザー名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
              />

              <label className={styles.label}>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />

              <label className={styles.label}>プロフィール</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.textarea}
              />

              {/* 🔹 保存ボタン */}
              <Button onClick={handleSave} className={styles.button}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
