"use client";

import React, { useState } from "react";
import styles from "./PostCard.module.css";
import Image from "next/image";

type PostCardProps = {
    userIconUrl: string | null | undefined;
    username: string;
    content: string;
};

const Default_user_icon = "/defaultIcon.png";

export default function PostCard({ userIconUrl, username, content }: PostCardProps) {

    const initialSrc = userIconUrl || Default_user_icon;
    const [iconSrc, setIconSrc] = useState(initialSrc);

    return (
        <div className = {styles.postCard}>
            <div className = {styles.header}>
                <div>
                    <Image 
                        src={iconSrc} 
                        alt={`${username} Icon`} 
                        className={styles.userIcon}
                        width={48}
                        height={48}
                        onError={()=>{
                            if (iconSrc !== Default_user_icon){
                                setIconSrc(Default_user_icon)
                            }
                        }} 
                    />
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