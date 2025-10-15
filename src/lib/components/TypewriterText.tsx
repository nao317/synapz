'use client';

import React, { useEffect, useState, ReactElement, useRef } from "react";
import styles from './TypewriterText.module.css'; // ← CSS追加用

interface Props {
    children: ReactElement; // <h1>Login</h1> のような1要素を受け取る
    speed?: number;         // 打つ速さ（ms）
}

export default function TypewriterText({ children, speed = 130 }: Props) {
    const [text, setText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLElement>(null);
    
    // 子要素からテキストを抽出する関数
    const extractText = (element: React.ReactNode): string => {
        if (typeof element === 'string') return element;
        if (typeof element === 'number') return element.toString();
        
        if (React.isValidElement(element)) {
            if (element.type === 'br') return '\n';
            
            const children = (element.props as { children?: React.ReactNode })?.children;
            if (typeof children === 'string') return children;
            if (Array.isArray(children)) {
                return children.map(child => 
                    typeof child === 'string' ? child : 
                    React.isValidElement(child) ? extractText(child) : ''
                ).join('');
            }
            if (React.isValidElement(children)) {
                return extractText(children);
            }
        }
        return '';
    };

    const fullText = extractText(children);

    // Intersection Observerで要素が見えるようになったら検出
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // 一度見えたら監視を停止
                }
            },
            { threshold: 0.3 } // 30%見えたらトリガー
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return; // 見えるまではタイプライター効果を開始しない
        
        setText(""); // リセット
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [fullText, speed, isVisible]); // isVisibleを依存配列に追加

    // 子要素の中身を上書きして返す（カーソル付）
    return React.cloneElement(children, {
        ref: elementRef, // refを追加
        children: (
            <>
                {text.split('\n').map((line, index, array) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                    </React.Fragment>
                ))}
                <span className={styles.cursor} />
            </>
        ),
    } as Record<string, unknown>);
}
