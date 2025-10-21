import React, { useState } from "react";
import styles from "./TimeLine.module.css";
import PostCard from "./PostCard";

const posts = [
    {
        id: "1",
        username: "Next.js Lover",
        content: "Next.jsのサーバーコンポーネントは本当にすごい！データ取得がシンプルになるね。",
        avatar_url: "/defaultIcon.png",
    },
    {
        id: "2",
        username: "React Fan",
        content: "Tailwind CSSを使い始めてから、スタイリングが爆速になった気がする。",
        avatar_url: null,
    },
    {
        id: "3",
        username: "Supabase User",
        content: "Supabaseのリアルタイム機能、Twitterみたいなアプリと相性抜群だよね。",
        avatar_url: "/defaultIcon.png",
    },
];

export default function TimeLine() {
    return (
        <div className={styles.timeLine}>
            <div className={styles.header}>
                <nav className={styles.nav}>
                    {/* リンクをつける */}
                    <div>TimeLine</div>
                    <span className={styles.ceparate}>|</span>
                    <div>Article</div>
                </nav>
            </div>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    postId={post.id}
                    userIconUrl={post.avatar_url}
                    username={post.username}
                    content={post.content}
                    initialIsLiked={false}
                    initialLikeCount={0}
                />
            )
            )}
        </div>
    )
}