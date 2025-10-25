"use client";

import styles from "./TimeLine.module.css";
import PostCard from "./PostCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

type TimeLinePost = {
    id: string;
    content: string;
    created_at: string;
    user: {
        id: string;
        name: string | null;
        avatarurl: string | null;
    };
};

export default function TimeLine() {
    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );
    const router = useRouter();

    const [posts, setPosts] = useState<TimeLinePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/login");
                    return;
                }

                const response = await fetch('/api/post', { cache: 'no-store' });

                if (!response.ok) {
                    const text = await response.text().catch(() => '');
                    throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
                }

                const data = await response.json();

                setPosts(data);
            } catch (e) {
                console.error('Failed to fetch posts', e);
                setError("投稿の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [router, supabase]);

    if (loading) {
        return <div>読み込み中...</div>
    }
    if (error) {
        return <div>エラーが発生しました: {error}</div>
    }

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
                    userIconUrl={post.user.avatarurl ?? "/defaultIcon.png"}
                    username={post.user.name ?? "Unknown"}
                    content={post.content}
                    initialIsLiked={false}
                    initialLikeCount={0}
                />
            )
            )}
        </div>
    )
}