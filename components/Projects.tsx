"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Projects.module.css";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const projects = [
        {
            title: "VR Horror Game",
            description: "Developed for Varlive HK Halloween events. A terrifying immersive experience built with Unity and C# featuring dynamic AI and atmospheric sound design.",
            tags: ["Unity", "C#", "Oculus SDK"],
            images: [
                "/projects/horror/horror1.jpg",
                "/projects/horror/horror2.jpg",
                "/projects/horror/horror3.jpg",
                "/projects/horror/horror4.jpg",
                "/projects/horror/horror5.jpg"
            ],
            link: "#"
        },
        {
            title: "HK Traditional Market Museum VR",
            description: "A cultural preservation project showcasing 1841-era Central Market history through an interactive VR museum. Features historical maps, photography galleries, and immersive storytelling.",
            tags: ["Unity", "VR Museum", "HK History"],
            images: [
                "/projects/market/market1.jpg",
                "/projects/market/market2.jpg",
                "/projects/market/market3.jpg",
                "/projects/market/market4.jpg"
            ],
            link: "#"
        },
        {
            title: "VR Learning Modules",
            description: "Interactive content created for primary school tuition centers. Designed to improve student engagement in subjects like ICT through VR gamification.",
            tags: ["Unity", "EdTech", "Interactive"],
            images: [],
            link: "#"
        },
        {
            title: "Image Converter Tool",
            description: "Client-side image conversion tool capable of handling various formats (HEIC, SVG, PDF) offline. Built with modern web technologies.",
            tags: ["React", "TypeScript", "PWA"],
            images: ["/projects/icon_converter.png"],
            link: "https://ifung2020.github.io/ifungconvertor/",
            github: "https://github.com/ifung2020"
        }
    ];

    const openLightbox = (project: any) => {
        if (project.images.length > 0) {
            setSelectedProject(project);
            setCurrentImageIndex(0);
            document.body.style.overflow = "hidden";
        }
    };

    const closeLightbox = () => {
        setSelectedProject(null);
        document.body.style.overflow = "unset";
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    };

    return (
        <section className={`section ${styles.projects}`} id="projects">
            <div className="container">
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Key <span className="neon-text">Projects</span>
                </motion.h2>

                <div className={styles.grid}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.card} ${project.images.length > 0 ? styles.clickable : ""}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => openLightbox(project)}
                        >
                            <div className={styles.imageGallery}>
                                {project.images.length > 0 ? (
                                    <div className={styles.imageGrid}>
                                        <Image
                                            src={project.images[0]}
                                            alt={project.title}
                                            fill
                                            className={styles.mainImage}
                                        />
                                        {project.images.length > 1 && (
                                            <div className={styles.overlay}>
                                                <span>+{project.images.length - 1} Images</span>
                                            </div>
                                        )}
                                        <div className={styles.clickHint}>
                                            <span>View Gallery</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span>{project.title}</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <div className={styles.tags}>
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <p className={styles.description}>{project.description}</p>
                                <div className={styles.links}>
                                    {project.link !== "#" && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.link} onClick={(e) => e.stopPropagation()}>
                                            Live Demo <ExternalLink size={14} />
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link} onClick={(e) => e.stopPropagation()}>
                                            <Github size={14} /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className={styles.lightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                    >
                        <motion.div
                            className={styles.lightboxContent}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.closeBtn} onClick={closeLightbox}>
                                <X size={32} />
                            </button>

                            <div className={styles.lightboxImageContainer}>
                                <Image
                                    src={selectedProject.images[currentImageIndex]}
                                    alt={selectedProject.title}
                                    fill
                                    className={styles.lightboxImage}
                                />
                            </div>

                            {selectedProject.images.length > 1 && (
                                <>
                                    <button className={styles.navBtnPrev} onClick={prevImage}>
                                        <ChevronLeft size={48} />
                                    </button>
                                    <button className={styles.navBtnNext} onClick={nextImage}>
                                        <ChevronRight size={48} />
                                    </button>
                                    <div className={styles.imageCounter}>
                                        {currentImageIndex + 1} / {selectedProject.images.length}
                                    </div>
                                </>
                            )}

                            <div className={styles.lightboxDetails}>
                                <h3>{selectedProject.title}</h3>
                                <p>{selectedProject.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

