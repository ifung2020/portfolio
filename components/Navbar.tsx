"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#toolkit" },
        { name: "Exp", href: "#experience" },
        { name: "Projects", href: "#projects" },
    ];

    return (
        <motion.nav
            className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.container}>
                <motion.div
                    className={styles.logo}
                    whileHover={{ scale: 1.05, textShadow: "0 0 15px var(--primary)" }}
                >
                    <Link href="/">SL</Link>
                </motion.div>

                <div className={styles.links}>
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className={styles.link}>
                            {item.name}
                        </Link>
                    ))}
                    <a
                        href="https://github.com/ifung2020"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.githubIcon}
                        aria-label="GitHub Profile"
                    >
                        <Github size={20} />
                    </a>
                </div>
            </div>
        </motion.nav>
    );
}
