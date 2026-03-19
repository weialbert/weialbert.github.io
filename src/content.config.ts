import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()),
		draft: z.boolean().default(false),
		image: z.string().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		techStack: z.array(z.string()),
		draft: z.boolean().optional().default(false),
		featured: z.boolean().default(false),
		githubUrl: z.string().optional(),
		liveUrl: z.string().optional(),
		image: z.string().optional(),
		order: z.number().optional(),
	}),
});

const photos = defineCollection({
	loader: glob({ base: "./src/content/photos", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		caption: z.string().optional(),
		date: z.date(),
		location: z.string().optional(),
		tags: z.array(z.string()),
		image: z.string(),
		featured: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, projects, photos };
