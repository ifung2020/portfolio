"use client";

import { motion } from "framer-motion";
import styles from "./About.module.css";

export default function About() {
    const stats = [
        { label: "Exp in Tech", value: "3+ Years" },
        { label: "VR Projects", value: "5+" },
        { label: "Learning", value: "HSUHK" }
    ];

    return (
        <section className={`section ${styles.about}`} id="about">
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        className={styles.content}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={styles.title}>About <span className="neon-text">Me</span></h2>
                        <p className={styles.paragraph}>
                            I am a final-year MSIM student at Hang Seng University of Hong Kong (HSUHK).
                            My journey in tech began with a curiosity for immersive worlds, leading me to specialize in VR Development and IT Operations.
                        </p>
                        <p className={styles.paragraph}>
                            With a strong background in Unity and C#, I've had the privilege of working on professional-grade VR experiences,
                            including a horror game that entertained thousands during Halloween events. I thrive at the intersection of technical execution and creative problem-solving.
                        </p>

                        <div className={styles.stats}>
                            {stats.map((stat, index) => (
                                <div key={index} className={styles.statItem}>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.visual}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={`${styles.box} glass neon-box`}>
                            <div className={styles.boxContent}>
                                <h3>My Goal</h3>
                                <p>To redefine human interaction through immersive technology and seamless digital experiences.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
