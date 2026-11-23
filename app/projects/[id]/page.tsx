import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/portfolio";
import ProjectDetailView from "@/components/ProjectDetailView";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) {
    return { title: "Project Not Found — Steven Lai" };
  }
  return {
    title: `${project.title} — Steven Lai`,
    description: project.overview,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const idx = PROJECTS.findIndex((p) => p.id === id);
  if (idx === -1) {
    notFound();
  }

  const project = PROJECTS[idx];
  const prevProject = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <ProjectDetailView
      project={project}
      index={idx}
      total={PROJECTS.length}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
