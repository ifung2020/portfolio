"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Hero.module.css";
import { Github, Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            <div className={styles.grid}></div>
            <div className={styles.content}>
                <motion.div
                    className={styles.text}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className={styles.greeting}>Hello, I'm</p>
                    <h1 className={`${styles.name} neon-text`}>Steven Lai</h1>
                    <h2 className={styles.role}>VR Developer & Immersive Tech Enthusiast</h2>
                    <p className={styles.description}>
                        I build immersive experiences using Unity and C#. Final-year MSIM student at HSUHK,
                        blending technical skills with creative storytelling to craft engaging virtual worlds.
                    </p>

                    <div className={styles.buttons}>
                        <motion.a
                            href="#contact"
                            className={styles.cta}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--primary-glow)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mail size={18} /> Contact Me
                        </motion.a>
                        <motion.a
                            href="https://github.com/ifung2020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.cta} ${styles.outline}`}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--primary-glow)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Github size={18} /> GitHub
                        </motion.a>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.imageContainer}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/profile.png"
                            alt="Steven Lai"
                            width={400}
                            height={400}
                            priority
                            className={styles.profilePic}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
