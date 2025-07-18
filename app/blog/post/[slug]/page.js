import { Post } from "./Post";
import { logger } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getPost, getPostPaths } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 60;

export async function generateStaticParams() {
	try {
		const postpaths = await getPostPaths();
		return postpaths;
	} catch (error) {
		console.warn("Failed to generate static params for blog posts:", error);
		return [];
	}
}

export async function generateMetadata({ params }, parent) {
	const { slug } = await params;

	try {
		const post = await getPost(params);

		logger.info("Fetched Post:", post);

		if (!post) {
			logger.error(`Post not found. Slug: ${slug}`);
			return {};
		}

		const previousImages = (await parent).openGraph?.images || [];

		const keywords = post.keywords?.split(",") || [];
		logger.info("Keywords:", keywords);

		return {
			title: post.title,
			description: post.description ?? "",
			alternates: { canonical: `/blog/post/${slug}` },
			openGraph: {
				images: [
					{
						url: urlForImage(post?.mainImage)?.src,
						width: 1200, // 800
						height: 630, // 600
					},
					...previousImages,
				],
			},
			keywords: [...keywords, ...siteConfig.keywords, post.title],
		};
	} catch (error) {
		logger.warn("Failed to generate metadata for blog post:", error);
		return {
			title: "Blog Post",
			description: "Blog post not available",
		};
	}
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
	try {
		const post = await getPost(params);
		return <Post post={post} />;
	} catch (error) {
		console.warn("Failed to fetch blog post:", error);
		return <div>Blog post not available</div>;
	}
}
