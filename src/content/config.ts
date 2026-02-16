// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    featured: z.boolean().default(false),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    image: z.string().optional(),
    order: z.number().optional(),
  }),
});

const photos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    caption: z.string().optional(),
    date: z.date(),
    location: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, photos };
