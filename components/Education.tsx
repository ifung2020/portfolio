"use client";

import { motion } from "framer-motion";
import styles from "./Education.module.css";
import { GraduationCap } from "lucide-react";

export default function Education() {
    return (
        <section className={`section ${styles.education}`} id="education">
            <div className="container">
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Education <span className={styles.highlight}>& Academics</span>
                </motion.h2>

                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.iconWrapper}>
                        <GraduationCap size={48} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.university}>The Hang Seng University of Hong Kong (HSUHK)</h3>
                        <p className={styles.degree}>BSc in Management Science and Information Management (MSIM)</p>
                        <p className={styles.year}>Expected Graduation: Dec 2026</p>

                        <div className={styles.highlights}>
                            <div className={styles.highlight}>
                                <span className={styles.label}>Focus:</span> IT Operations, Automation & Immersive Tech
                            </div>
                            <div className={styles.highlight}>
                                <span className={styles.label}>Core:</span> Software Engineering, Data Analysis, Business Management
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
