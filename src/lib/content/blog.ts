import { type CollectionEntry, getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
	const posts = await getCollection("blog");
	return posts
		.filter((post) => !post.data.draft)
		.sort(
			(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
		);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
	const posts = await getPublishedBlogPosts();
	return posts.slice(0, limit);
}

export function formatBlogDate(
	date: Date,
	variant: "short" | "long" = "long",
): string {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: variant === "short" ? "short" : "long",
		day: "numeric",
	});
}
