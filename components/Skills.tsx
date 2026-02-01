"use client";

import { motion } from "framer-motion";
import styles from "./Skills.module.css";
import { Code, Users, Languages, Gamepad2, Brain, MessageCircle, Server, Terminal } from "lucide-react";

export default function Skills() {
    const skillCategories = [
        {
            title: "Technical",
            icon: <Gamepad2 size={24} />,
            skills: ["Unity Engine", "C# (Basic)", "VR Interaction", "IT Support"]
        },
        {
            title: "Professional",
            icon: <Brain size={24} />,
            skills: ["Problem Solving", "Teamwork", "Customer Care", "Event Hosting"]
        },
        {
            title: "Languages",
            icon: <Languages size={24} />,
            skills: ["Cantonese (Native)", "Putonghua (Native)", "English (Intermediate)"]
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
                    My <span className="neon-text">Toolkit</span>
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
