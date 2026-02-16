// @ts-check

import sitemap from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://weialbert.github.io",
	integrations: [sitemap()],
	vite: {
		plugins: [yaml()],
	},
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
	},
});
