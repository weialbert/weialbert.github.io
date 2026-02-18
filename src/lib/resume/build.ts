// src/lib/resume/build.ts
import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { PDFDocument } from "pdf-lib";
import YAML from "yaml";
import type { z } from "zod";
import { ProfilesSchema } from "./profiles.schema";
import { ResumeSchema } from "./resume.schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../../..");

async function loadAndValidate<T>(
	path: string,
	schema: z.ZodType<T>,
): Promise<T> {
	const filename = path.split("/").pop();
	const raw = await fs.readFile(path, "utf-8");
	const result = schema.parse(YAML.parse(raw));
	console.log(` [${filename}]: loading and validation successful`);
	return result;
}

async function assertSinglePagePdf(pdfData: Uint8Array, label: string) {
	const pdf = await PDFDocument.load(pdfData);
	const pageCount = pdf.getPageCount();
	if (pageCount !== 1) {
		throw new Error(
			`  [one page check]: Failed - ${label} (found ${pageCount} pages)`,
		);
	}
	console.log(`  [one page check]: Passed for "${label}"`);
}

const profilesData = await loadAndValidate(
	join(projectRoot, "src/data/profiles.yaml"),
	ProfilesSchema,
);
await loadAndValidate(join(projectRoot, "src/data/resume.yaml"), ResumeSchema);

const frontendProfiles: Array<{
	name: string;
	label: string;
	description: string;
	order: number;
	hidden?: boolean;
}> = [];

interface BuildOptions {
	profile: string;
	outputDir?: string;
}

async function buildResume({
	profile,
	outputDir = join(projectRoot, "public/resume"),
}: BuildOptions) {
	const profileConfig = profilesData.profiles[profile];
	if (!profileConfig)
		throw new Error(`Profile "${profile}" not found in profiles.yaml`);

	console.log(`[${profile}]: building resume`);

	const profileDir = join(outputDir, profile);
	await fs.mkdir(profileDir, { recursive: true });

	const templatePath = join(projectRoot, "src/lib/resume/resume.typ");
	const pdfPath = join(profileDir, "resume.pdf");
	const typPath = join(profileDir, "resume.typ");

	try {
		const compiler = NodeCompiler.create({ workspace: projectRoot });
		const pdfData = await compiler.pdf({
			mainFilePath: "src/lib/resume/resume.typ",
			inputs: { profile },
		});

		await fs.writeFile(pdfPath, pdfData);
		await fs.copyFile(templatePath, typPath);

		if (profileConfig.one_page) {
			await assertSinglePagePdf(pdfData, profileConfig.label);
		}

		frontendProfiles.push({
			name: profile,
			label: profileConfig.label,
			description: profileConfig.description,
			order: profileConfig.order,
			hidden: profileConfig.hidden,
		});

		console.log(`[${profile}]: build completed successfully`);
	} catch (err) {
		console.error(`[${profile}]: build failed - `, err);
		throw err;
	}
}

async function buildAllProfiles() {
	const profileNames = Object.keys(profilesData.profiles);
	console.log(`\nBuilding ${profileNames.length} resume profiles...\n`);

	for (const profile of profileNames) {
		await buildResume({ profile });
	}

	const outputJson = join(projectRoot, "public/resume/profiles.json");
	await fs.writeFile(
		outputJson,
		JSON.stringify(
			frontendProfiles.sort((a, b) => a.order - b.order),
			null,
			2,
		),
	);

	console.log(`Frontend profiles metadata written to ${outputJson}\n`);
}

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
			const outputJson = join(projectRoot, "public/resume/profiles.json");
			await fs.writeFile(
				outputJson,
				JSON.stringify(
					[
						{
							name: profile,
							label: profilesData.profiles[profile].label,
							description: profilesData.profiles[profile].description,
							order: profilesData.profiles[profile].order,
							hidden: profilesData.profiles[profile].hidden,
						},
					],
					null,
					2,
				),
			);
		}
		console.log("\nAll resumes built successfully\n");
	} catch (err) {
		console.error("Build failed:", err);
		process.exit(1);
	}
})();
