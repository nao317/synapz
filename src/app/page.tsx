'use client';
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/lib/components/Button";
import styles from "./page.module.css";
import { HyperspaceBackground } from "@/lib/components/HyperspaceBackground";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles["home-container"]}>
      <HyperspaceBackground />
      <motion.h1
        className={styles["home-title"]}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      >
        Synapz
      </motion.h1>

      <motion.div
        className={styles["home-button-container"]}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <Button variant="primary" size="md" onClick={() => router.push("/login")}>ログイン</Button>
        <Button variant="primary" size="md">サインアップ</Button>
      </motion.div>
    </div>
  );
}