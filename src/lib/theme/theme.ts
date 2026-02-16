export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("theme") as Theme | null;
}

export function setTheme(theme: Theme): void {
	if (typeof window === "undefined") return;
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem("theme", theme);
}

export function initTheme(): void {
	const stored = getStoredTheme();
	const theme = stored || getSystemTheme();
	setTheme(theme);
}
