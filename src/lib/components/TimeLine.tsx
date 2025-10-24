"use client";

import styles from "./TimeLine.module.css";
import PostCard from "./PostCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";


export default function TimeLine() {
    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );
    const router = useRouter();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosets = async  () => {
            setLoading(true);
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                
                if (!user) {
                    router.push("/login");
                    return;
                }

                const response = await fetch('/api/posts', { cache: 'no-store' });

                if (!response.ok) {
                    const text = await response.text().catch(() => '');
                    throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
                }

                const data = await response.json();

                setPosts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);  
            }
        };
        fetchPosets();
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
                    userIconUrl={post.avatarurl ?? "/defaultIcon.png"}
                    username={post.username ?? "Unknown"}
                    content={post.content}
                    initialIsLiked={false}
                    initialLikeCount={0}
                />
            )
            )}
        </div>
    )
}