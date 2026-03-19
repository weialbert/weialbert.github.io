import { type CollectionEntry, getCollection } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
	const projects = await getCollection("projects");
	return projects
		.filter((project) => !project.data.draft)
		.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectEntry[]> {
	const projects = await getPublishedProjects();
	return projects.filter((project) => project.data.featured).slice(0, limit);
}
