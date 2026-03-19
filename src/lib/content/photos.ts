import { getCollection } from "astro:content";
import { existsSync } from "node:fs";
import { join } from "node:path";

const photosContentDir = join(process.cwd(), "src/content/photos");

export function hasPhotosContentDir(): boolean {
	return existsSync(photosContentDir);
}

export async function getPhotosCollection() {
	if (!hasPhotosContentDir()) {
		return [];
	}

	const photos = await getCollection("photos");
	return photos.filter((photo) => !photo.data.draft);
}
