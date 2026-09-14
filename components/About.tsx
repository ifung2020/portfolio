"use client";

import { motion } from "framer-motion";
import styles from "./About.module.css";

export default function About() {
    const stats = [
        { label: "Tech Experience", value: "3+ Years" },
        { label: "Projects Delivered", value: "6+" },
        { label: "Automation Tools", value: "4+" }
    ];

    return (
        <section className={`section ${styles.about}`} id="about">
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        className={styles.content}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={styles.title}>About <span className={styles.highlight}>Me</span></h2>
                        <p className={styles.paragraph}>
                            I am a final-year MSIM student at Hang Seng University of Hong Kong (HSUHK).
                            My journey in tech began with a curiosity for immersive worlds, leading me to specialize in VR Development, IT Operations, and Workflow Automation.
                        </p>
                        <p className={styles.paragraph}>
                            Whether I am building high-traffic VR games in Unity, ensuring 100% uptime for complex hardware networks, or engineering automated tools to streamline business operations, I thrive at the intersection of technical execution and operational efficiency.
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.box}>
                            <div className={styles.boxContent}>
                                <h3>My Approach</h3>
                                <p>I believe technology should solve real problems. From engaging virtual reality to robust backend automations, I build reliable, scalable solutions.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
