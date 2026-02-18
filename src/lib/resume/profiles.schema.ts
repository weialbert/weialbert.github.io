// src/lib/resume/profiles.schema.ts
import { z } from "zod";

export const ResumeProfileSchema = z.object({
	label: z.string(),
	description: z.string(),
	order: z.number(),
	hidden: z.boolean().default(false),
	one_page: z.boolean(),
	min_importance: z.number(),
	max_bullets_per_experience: z.number(),
	include_tags: z.array(z.string()).nullable(),
	exclude_tags: z.array(z.string()).nullable(),
});

export const ProfilesSchema = z.object({
	profiles: z.record(z.string(), ResumeProfileSchema),
	config: z.object({
		max_bullet_length: z.number(),
	}),
});

export type ResumeProfileYaml = z.infer<typeof ResumeProfileSchema>;

export type ResumeProfile = ResumeProfileYaml & {
	name: string;
};

// export type ProfilesYaml = z.infer<typeof ProfilesSchema>;
