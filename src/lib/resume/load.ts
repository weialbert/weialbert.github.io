// src/lib/resume/load.ts

import { readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type { ResumeData } from "./resume.schema";
import { ResumeSchema } from "./resume.schema";

const resumeYamlPath = join(process.cwd(), "src/data/resume.yaml");

let _cache: ResumeData | null = null;

export function getResumeData(): ResumeData {
	if (_cache) return _cache;
	const raw = readFileSync(resumeYamlPath, "utf-8");
	_cache = ResumeSchema.parse(YAML.parse(raw));
	return _cache;
}
