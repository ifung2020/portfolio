"use client";

import styles from "./Footer.module.css";
import { Mail, Phone, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className={styles.footer} id="contact">
            <div className="container">
                <h2 className={styles.title}>Get In <span className="neon-text">Touch</span></h2>
                <div className={styles.contactInfo}>
                    <div className={styles.item}>
                        <Mail size={20} />
                        <a href="mailto:ifung97@gmail.com">ifung97@gmail.com</a>
                    </div>
                    <div className={styles.item}>
                        <Phone size={20} />
                        <a href="tel:+85254054452">+852 5405 4452</a>
                    </div>
                    <div className={styles.item}>
                        <Github size={20} />
                        <a href="https://github.com/ifung2020" target="_blank" rel="noopener noreferrer">github.com/ifung2020</a>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Steven Lai. Crafted with precision.
                </div>
            </div>
        </footer>
    );
}
