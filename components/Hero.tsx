"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Hero.module.css";
import { Github, Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            <div className={styles.content}>
                <motion.div
                    className={styles.text}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className={styles.greeting}>Hello, I'm</p>
                    <h1 className={styles.name}>Steven Lai</h1>
                    <h2 className={styles.role}>Operations Automation & VR Developer</h2>
                    <p className={styles.description}>
                        I engineer practical technical solutions, bridging the gap between business operations and software engineering. From automating workflows at scale to building high-traffic VR experiences.
                    </p>

                    <div className={styles.buttons}>
                        <motion.a
                            href="#contact"
                            className={styles.cta}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Mail size={18} /> Contact Me
                        </motion.a>
                        <motion.a
                            href="https://github.com/ifung2020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.cta} ${styles.outline}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Github size={18} /> GitHub
                        </motion.a>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.imageContainer}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
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
