import { getCollection } from "astro:content";

export async function getPhotosCollection() {
	const photos = await getCollection("photos");
	return photos.filter((photo) => !photo.data.draft);
}
