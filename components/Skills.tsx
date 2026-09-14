"use client";

import { motion } from "framer-motion";
import styles from "./Skills.module.css";
import { Code, Settings, Languages, Gamepad2, Wrench, Globe } from "lucide-react";

export default function Skills() {
    const skillCategories = [
        {
            title: "Development & Languages",
            icon: <Code size={24} />,
            skills: ["C# (OOP)", "TypeScript / JavaScript", "HTML / CSS", "React & Next.js"]
        },
        {
            title: "VR & Interactive Tech",
            icon: <Gamepad2 size={24} />,
            skills: ["Unity Engine", "Oculus SDK", "VR Interaction Design", "AI State Machines"]
        },
        {
            title: "Operations & Automation",
            icon: <Settings size={24} />,
            skills: ["Process Automation & Scripting", "Hardware Troubleshooting", "System Deployment", "IT Support"]
        },
        {
            title: "Spoken Languages",
            icon: <Globe size={24} />,
            skills: ["Cantonese (Native)", "Mandarin (Native)", "English (Professional)"]
        }
    ];

    return (
        <section className={`section ${styles.skills}`} id="skills">
            <div className="container">
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Technical <span className={styles.highlight}>Toolkit</span>
                </motion.h2>

                <div className={styles.grid}>
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    {category.icon}
                                </div>
                                <h3 className={styles.categoryTitle}>{category.title}</h3>
                            </div>
                            <ul className={styles.list}>
                                {category.skills.map((skill, i) => (
                                    <li key={i} className={styles.listItem}>
                                        <span className={styles.bullet}></span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
