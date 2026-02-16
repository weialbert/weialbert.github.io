// src/lib/resume/build.ts
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../..');

interface BuildOptions {
  profile: string;
  outputDir?: string;
}

// Build a single resume profile
async function buildResume(options: BuildOptions): Promise<void> {
  const { profile, outputDir = join(projectRoot, 'public/resume') } = options;
  
  console.log(`Building resume with profile: ${profile}`);
  
  const profileDir = join(outputDir, profile);
  await fs.mkdir(profileDir, { recursive: true });
  
  const templatePath = join(projectRoot, 'src/lib/resume/resume.typ');
  const pdfPath = join(profileDir, 'resume.pdf');
  const typPath = join(profileDir, 'resume.typ');
  
  try {
    const compiler = NodeCompiler.create({
      workspace: projectRoot
    });
    
    const pdfData = await compiler.pdf({
      mainFilePath: 'src/lib/resume/resume.typ',
      inputs: {
        profile: profile
      }
    });
    
    await fs.writeFile(pdfPath, pdfData);
    console.log(` Compiled ${pdfPath}`);
    
    await fs.copyFile(templatePath, typPath);
    console.log(` Copied ${typPath}`);
    
  } catch (error) {
    console.error(` Failed to build ${profile}:`, error);
    throw error;
  }
}

// Build all resume profiles
async function buildAllProfiles(): Promise<void> {
  const profiles = ['default', 'onepage'];
  
  console.log(`\n Building ${profiles.length} resume profiles...\n`);
  
  for (const profile of profiles) {
    await buildResume({ profile });
  }
  
  console.log('\n All resumes built successfully!\n');
}

// CLI entry point
const args = process.argv.slice(2);
const profileArg = args.find(arg => arg.startsWith('--profile='));
const buildAll = args.includes('--all');

(async () => {
  try {
    if (buildAll || !profileArg) {
      await buildAllProfiles();
    } else {
      const profile = profileArg.split('=')[1];
      await buildResume({ profile });
    }
  } catch (error) {
    console.error(' Build failed:', error);
    process.exit(1);
  }
})();