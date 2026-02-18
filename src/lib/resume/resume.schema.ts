// src/lib/resume/resume.schema.ts
import { z } from "zod";

const YearOrPresent = z.union([z.number().int(), z.literal("present")]);

export const PersonalSchema = z.object({
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	phone: z.string(),
	linkedin: z.string(),
	github: z.string(),
	portfolio: z.string(),
});

export const DegreeSchema = z.object({
	degree: z.string(),
	start: z.number().int(),
	end: z.number().int(),
	gpa: z.string().optional(),
	details: z.array(z.string()).optional(),
});

export const SchoolSchema = z.object({
	institution: z.string(),
	location: z.string(),
	degrees: z.array(DegreeSchema),
	awards: z.array(z.string()).optional(),
});

export const BulletSchema = z.object({
	id: z.string(),
	text: z.string(),
	importance: z.number().int().min(0).max(5),
	tags: z.array(z.string()),
});

export const ExperienceSchema = z.object({
	id: z.string(),
	company: z.string(),
	role: z.string(),
	location: z.string(),
	start: z.number().int(),
	end: YearOrPresent,
	tags: z.array(z.string()),
	bullets: z.array(BulletSchema),
});

export const ProjectBulletSchema = z.object({
	text: z.string(),
});

export const ProjectDatesSchema = z.object({
	start: z.number().int(),
	end: z.number().int(),
});

export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	dates: ProjectDatesSchema,
	"tech-used": z.string().optional(),
	url: z.string().optional(),
	bullets: z.array(ProjectBulletSchema),
});

export const PublicationSchema = z.object({
	id: z.string(),
	title: z.string(),
	journal: z.string(),
	year: z.number().int(),
	authors: z.array(z.string()),
});

export const LeadershipSchema = z.object({
	id: z.string(),
	title: z.string(),
	dates: z.string(),
	bullets: z.array(z.string()),
});

export const SkillCategorySchema = z.object({
	category: z.string(),
	items: z.array(z.string()),
});

export const ResumeSchema = z.object({
	personal: PersonalSchema,
	education: z.array(SchoolSchema),
	experiences: z.array(ExperienceSchema),
	projects: z.array(ProjectSchema).optional(),
	publications: z.array(PublicationSchema),
	leadership: z.array(LeadershipSchema),
	skills: z.array(SkillCategorySchema),
});

export type Personal = z.infer<typeof PersonalSchema>;
export type Degree = z.infer<typeof DegreeSchema>;
export type School = z.infer<typeof SchoolSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type Leadership = z.infer<typeof LeadershipSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type ResumeData = z.infer<typeof ResumeSchema>;
