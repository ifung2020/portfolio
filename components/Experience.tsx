"use client";

import { motion } from "framer-motion";
import styles from "./Experience.module.css";

export default function Experience() {
    const experiences = [
        {
            role: "Part-time Team Member",
            company: "Decathlon HK",
            period: "Current (1 year)",
            description: "Assisting customers and managing sports equipment operations."
        },
        {
            role: "Operations & VR Game Dev",
            company: "Varlive HK",
            period: "1 Year",
            description: "Operated VR equipment, developed a VR horror game for Halloween events using Unity & C#, and ensured smooth customer experiences."
        },
        {
            role: "VR Operations Leader",
            company: "Sandbox VR HK",
            period: "1 Year",
            description: "Managed VR sessions, troubleshot equipment issues, and ensured high-quality immersive experiences for guests."
        },
        {
            role: "LARP Host & Gamemaster",
            company: "CrimeLab, Kwun Tong",
            period: "Apr 2021 – Aug 2022",
            description: "Hosted classic tabletop/board games and LARP events. Created immersive scripts and led storytelling sessions."
        },
        {
            role: "Tutor",
            company: "QESOSA, Tin Shui Wai",
            period: "Sep 2021 – Aug 2022",
            description: "Created lesson plans and teaching materials to aid English Grammar learning."
        }
    ];

    return (
        <section className={`section ${styles.experience}`} id="experience">
            <div className="container">
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    My <span className="neon-text">Journey</span>
                </motion.h2>

                <div className={styles.timeline}>
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={styles.dot}></div>
                            <div className={styles.content}>
                                <h3 className={styles.role}>{exp.role}</h3>
                                <h4 className={styles.company}>{exp.company}</h4>
                                <p className={styles.period}>{exp.period}</p>
                                <p className={styles.description}>{exp.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
