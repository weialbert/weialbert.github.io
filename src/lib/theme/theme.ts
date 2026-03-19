export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

declare global {
	interface Window {
		__themeControllerInitialized?: boolean;
	}
}

function isTheme(value: string | null): value is Theme {
	return value === "light" || value === "dark";
}

export function resolveThemeValue(
	storedTheme: string | null,
	prefersDark: boolean,
): Theme {
	return isTheme(storedTheme) ? storedTheme : prefersDark ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") return null;
	const value = localStorage.getItem(THEME_STORAGE_KEY);
	return isTheme(value) ? value : null;
}

export function resolveTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return resolveThemeValue(
		getStoredTheme(),
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	);
}

export function applyTheme(
	theme: Theme,
	documentRoot: Document = document,
): void {
	const root = documentRoot.documentElement;
	root.setAttribute("data-theme", theme);
	root.style.colorScheme = theme;
}

export function setTheme(theme: Theme): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
	applyTheme(theme);
}

export function syncTheme(documentRoot: Document = document): void {
	applyTheme(resolveTheme(), documentRoot);
}

export function initThemeController(): void {
	if (typeof window === "undefined" || window.__themeControllerInitialized)
		return;

	window.__themeControllerInitialized = true;
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	const syncSystemTheme = () => {
		if (!getStoredTheme()) {
			syncTheme();
		}
	};

	syncTheme();

	mediaQuery.addEventListener("change", syncSystemTheme);
	window.addEventListener("storage", () => {
		syncTheme();
	});

	document.addEventListener("astro:before-swap", (event) => {
		if (!("newDocument" in event) || !(event.newDocument instanceof Document))
			return;
		syncTheme(event.newDocument);
	});

	document.addEventListener("astro:page-load", () => {
		syncTheme();
	});
}
