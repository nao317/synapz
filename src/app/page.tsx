'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/lib/components/Button";
import styles from "./page.module.css";
import TypewriterText  from '../lib/components/TypewriterText';
import ScrollHint from '../lib/components/ScrollHint';
import { HyperspaceBackground } from "@/lib/components/HyperspaceBackground";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const updateWindowHeight = () => setWindowHeight(window.innerHeight);
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  return (
    <div className={styles.pageRoot}>
      <HyperspaceBackground />

      {/* ===== Hero (スクロールで移動するタイトル＋ボタン) ===== */}
      <motion.div
        className={styles.hero}
        style={{
          transform: `translateY(-${scrollY * 0.5}px)`,
          opacity: windowHeight > 0 ? Math.max(0, 1 - scrollY / (windowHeight * 0.8)) : 1
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className={styles.homeTitle}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        >
          Synapz
        </motion.h1>

        <motion.div
          className={styles.homeButtonContainer}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <Button variant="primary" size="md" onClick={() => router.push("/login")}>
            ログイン
          </Button>
          <Button variant="primary" size="md" onClick={() => router.push("/signup")}>
            サインアップ
          </Button>
        </motion.div>

        {/* スクロールヒントをHero内に配置 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className={styles.scrollHintContainer}
        >
          <ScrollHint />
        </motion.div>
      </motion.div>

      {/* ===== Concept以下 ===== */}
      <main className={styles.contentWrapper}>
        <motion.section
          className={styles.conceptSection}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className={styles.conceptTitle}
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Concept
          </motion.h2>
          <TypewriterText>
            <p className={styles.conceptText}>
              Synapzは、学びをつなぐSNS。<br />
              教え合い、学び合い、知識を共有する場所。
            </p>
          </TypewriterText>
        </motion.section>

        <motion.section
          className={styles.conceptSection}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className={styles.conceptTitle}
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Features
          </motion.h2>
          <TypewriterText>
            <p className={styles.conceptText}>
              記事投稿・質問共有・リアルタイムコメントなど、<br />
              学びを広げるための機能を提供します。
            </p>
          </TypewriterText>
        </motion.section>
      </main>
    </div>
  );
}
