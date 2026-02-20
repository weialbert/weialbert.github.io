// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "astro/config";
import remarkGithubAlerts from "remark-github-alerts";

// https://astro.build/config
export default defineConfig({
	site: "https://weialbert.github.io",
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [yaml()],
	},
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
		remarkPlugins: [remarkGithubAlerts],
	},
});
