'use client';

import React, { useEffect, useState, ReactElement } from "react";
import styles from './TypewriterText.module.css'; // ← CSS追加用

interface Props {
    children: ReactElement; // <h1>Login</h1> のような1要素を受け取る
    speed?: number;         // 打つ速さ（ms）
}

export default function TypewriterText({ children, speed = 130 }: Props) {
    const [text, setText] = useState("");
    const fullText = (React.isValidElement(children) && children.props && typeof (children.props as { children?: string }).children === 'string' ? (children.props as { children?: string }).children : "") || "";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [fullText, speed]);

    // 子要素の中身を上書きして返す（カーソル付）
    return React.cloneElement(children, {
        children: (
            <>
                {text}
                <span className={styles.cursor} />
            </>
        ),
    } as Record<string, unknown>);
}
