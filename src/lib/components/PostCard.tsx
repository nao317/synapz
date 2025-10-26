"use client";

import React, { useState } from "react";
import styles from "./PostCard.module.css";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import { Post } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

type PostCardProps = {
    post: Post;
};

const Default_user_icon = "/defaultIcon.png";

export default function PostCard({ post }: PostCardProps) {
    const { user, content, likes, image } = post;
    const initialSrc = user?.avatarurl || Default_user_icon;
    const username = user?.name || "Unknown User";

    const [iconSrc, setIconSrc] = useState(initialSrc);
    // 本来はユーザーがいいねしているかどうかの情報も必要
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes?.length || 0);

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
                <MarkdownRenderer>{content}</MarkdownRenderer>
                {image && <Image src={image} alt="Post image" width={500} height={300} />}
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