import { execSync } from "node:child_process";

export interface CommitInfo {
	shortHash: string;
	date: Date | null;
	url: string;
}

function normalizeRemoteUrl(remoteUrl: string): string {
	const trimmedUrl = remoteUrl.trim().replace(/\.git$/, "");
	if (!trimmedUrl) return "";

	const sshMatch = trimmedUrl.match(/^git@([^:]+):(.+)$/);
	if (sshMatch) {
		const [, host, path] = sshMatch;
		return `https://${host}/${path}`;
	}

	const protocolMatch = trimmedUrl.match(/^(ssh|git):\/\/git@([^/]+)\/(.+)$/);
	if (protocolMatch) {
		const [, , host, path] = protocolMatch;
		return `https://${host}/${path}`;
	}

	return trimmedUrl;
}

export function getCommitInfo(): CommitInfo {
	try {
		const shortHash = execSync("git rev-parse --short HEAD", {
			encoding: "utf-8",
		}).trim();
		const fullHash = execSync("git rev-parse HEAD", {
			encoding: "utf-8",
		}).trim();
		const timestamp = execSync("git log -1 --pretty=%ai", {
			encoding: "utf-8",
		}).trim();

		let remoteUrl = "";
		try {
			remoteUrl = execSync("git config --get remote.origin.url", {
				encoding: "utf-8",
			}).trim();
		} catch {
			remoteUrl = "";
		}

		const repoUrl = normalizeRemoteUrl(remoteUrl);

		return {
			shortHash,
			date: timestamp ? new Date(timestamp) : null,
			url: repoUrl ? `${repoUrl}/commit/${fullHash}` : "",
		};
	} catch {
		return {
			shortHash: "",
			date: null,
			url: "",
		};
	}
}
