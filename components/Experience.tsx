"use client";

import { motion } from "framer-motion";
import styles from "./Experience.module.css";

export default function Experience() {
    const experiences = [
        {
            role: "Omni Sports Leader (Part-time)",
            company: "Decathlon HK (Tuen Mun)",
            period: "Current",
            description: "Adapted and deployed a corporate IT shipment file to automatically filter branch-specific data and alert store staff. Scripted automated email alert systems for safety compliance and built a batch sign-out tool to reduce daily administrative overhead."
        },
        {
            role: "Operations & VR Game Developer",
            company: "Varlive HK",
            period: "1 Year",
            description: "Proactively developed a seasonal VR horror game using Unity & C# for Halloween. Programmed AI NPC behaviors and managed mission-critical VR hardware for thousands of concurrent users."
        },
        {
            role: "VR Operations Leader",
            company: "Sandbox VR HK",
            period: "1 Year",
            description: "Led a technical team ensuring 100% uptime for high-volume immersive sessions. Troubleshot real-time networking, hardware, and software deployment issues."
        },
        {
            role: "LARP Host & Gamemaster",
            company: "CrimeLab, Kwun Tong",
            period: "Apr 2021 – Aug 2022",
            description: "Hosted classic tabletop/board games and LARP events. Created immersive scripts and led storytelling sessions."
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
                    Professional <span className={styles.highlight}>Experience</span>
                </motion.h2>

                <div className={styles.timeline}>
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className={styles.dot}></div>
                            <div className={styles.content}>
                                <h3 className={styles.role}>{exp.role}</h3>
                                <h4 className={styles.company}>{exp.company}</h4>
                                <span className={styles.period}>{exp.period}</span>
                                <p className={styles.description}>{exp.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
