"use client";

import React, { useState } from "react";
import styles from "./PostCard.module.css";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";

type PostCardProps = {
    postId: string;
    userIconUrl: string | null | undefined;
    username: string;
    content: string;
    initialIsLiked: boolean;
    initialLikeCount: number;
};

const Default_user_icon = "/defaultIcon.png";

export default function PostCard({
    postId,
    userIconUrl,
    username,
    content,
    initialIsLiked,
    initialLikeCount
}: PostCardProps) {

    const initialSrc = userIconUrl || Default_user_icon;
    const [iconSrc, setIconSrc] = useState(initialSrc);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
    return (
        <div className={styles.postCard}>
            <div className={styles.header}>
                <div>
                    <Image
                        src={iconSrc}
                        alt={`${username} Icon`}
                        className={styles.userIcon}
                        width={48}
                        height={48}
                        onError={() => {
                            if (iconSrc !== Default_user_icon) {
                                setIconSrc(Default_user_icon)
                            }
                        }}
                    />
                </div>
                <span className={styles.username}>
                    {username}
                </span>
            </div>
            <div className={styles.content}>
                {content}
            </div>
            <div className={styles.footer}>
                <button onClick={handleLikeClick} className={styles.likebutton}>
                    <ThumbsUp
                        size={25}
                        stroke="white"
                        fill={isLiked ? "#3b82f6" : "none"}

                    />
                    <span className={styles.likecount}>{likeCount}</span>
                </button>
            </div>
        </div>
    )
}