"use client";

import React from "react";
import styles from "./PostCard.module.css";

type PostCardProps = {
    userIconUel: string;
    username: string;
    content: string;
};

export default function PostCard({ userIconUel, username, content }: PostCardProps) {
    return (
        <div className = {styles.postCard}>
            <div className = {styles.header}>
                <div>
                    <img src="{userIconUrl}" alt="${username} Icon" className={styles.userIcon}/>
                </div>
                <span className = {styles.username}>
                    {username}
                </span>
            </div>
            <div className = {styles.content}>
                {content}
            </div>
        </div>
    )
}