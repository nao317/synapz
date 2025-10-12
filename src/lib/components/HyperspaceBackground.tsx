"use client";

import React, { useRef, useEffect } from "react";

interface Star {
    x: number;
    y: number;
    z: number; // 奥行き
}

export const HyperspaceBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stars: Star[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const numStars = 400;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
            });
        }

        const speed = 1;

        const draw = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
            ctx.translate(width / 2, height / 2);

            stars.forEach((star) => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                const sx = (star.x / star.z) * width;
                const sy = (star.y / star.z) * height;

                const radius = (1 - star.z / width) * 3;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();

                // 簡単に線の尾を追加
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx - (star.x / star.z) * speed * 2, sy - (star.y / star.z) * speed * 2);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            ctx.setTransform(1, 0, 0, 1, 0, 0); // リセット座標系
            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1,
                width: "100%",
                height: "100%",
            }}
        />
    );
};