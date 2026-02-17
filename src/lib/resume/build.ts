// src/lib/resume/build.ts

import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { PDFDocument } from "pdf-lib";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../../..");

interface ResumeProfile {
	one_page: boolean;
	min_importance: number;
	max_bullets_per_experience: number;
	include_tags: string[] | null;
	exclude_tags: string[] | null;
}

interface ProfilesYaml {
	profiles: Record<string, ResumeProfile>;
	config: {
		max_bullet_length: number;
	};
}

interface BuildOptions {
	profile: string;
	outputDir?: string;
}

const profilesConfig: ProfilesYaml = YAML.parse(
	await fs.readFile(join(projectRoot, "src/data/profiles.yaml"), "utf8"), // Load profiles
);

async function assertSinglePagePdf(
	pdfData: Uint8Array,
	label: string,
): Promise<void> {
	const pdf = await PDFDocument.load(pdfData);
	const pageCount = pdf.getPageCount();

	if (pageCount !== 1) {
		throw new Error(
			` [One Page Check]: Failed - ${label} (found ${pageCount})`,
		);
	}
	console.log(" [One Page Check]: Passed");
}

async function buildResume(options: BuildOptions): Promise<void> {
	const { profile, outputDir = join(projectRoot, "public/resume") } = options;

	console.log(`Building resume with profile: ${profile}`);

	const profileDir = join(outputDir, profile);
	await fs.mkdir(profileDir, { recursive: true });

	const templatePath = join(projectRoot, "src/lib/resume/resume.typ");
	const pdfPath = join(profileDir, "resume.pdf");
	const typPath = join(profileDir, "resume.typ");

	try {
		const compiler = NodeCompiler.create({
			workspace: projectRoot,
		});

		const pdfData = await compiler.pdf({
			mainFilePath: "src/lib/resume/resume.typ",
			inputs: {
				profile: profile,
			},
		});

		// Enforce one-page constraint if specified in profile
		if (profilesConfig.profiles?.[profile]?.one_page === true) {
			await assertSinglePagePdf(pdfData, `Resume profile "${profile}"`);
		}

		await fs.writeFile(pdfPath, pdfData);
		console.log(` Compiled ${pdfPath}`);

		await fs.copyFile(templatePath, typPath);
		console.log(` Copied ${typPath}`);
	} catch (error) {
		console.error(` Failed to build ${profile}:`, error);
		throw error;
	}
}

async function buildAllProfiles(): Promise<void> {
	const profiles = Object.keys(profilesConfig.profiles ?? {});

	console.log(`\n Building ${profiles.length} resume profiles...\n`);

	for (const profile of profiles) {
		await buildResume({ profile });
	}

	console.log("\n All resumes built successfully!\n");
}

// CLI entry point
const args = process.argv.slice(2);
const profileArg = args.find((arg) => arg.startsWith("--profile="));
const buildAll = args.includes("--all");

(async () => {
	try {
		if (buildAll || !profileArg) {
			await buildAllProfiles();
		} else {
			const profile = profileArg.split("=")[1];
			await buildResume({ profile });
		}
	} catch (error) {
		console.error(" Build failed:", error);
		process.exit(1);
	}
})();
