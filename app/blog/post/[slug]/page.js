import { Post } from "./Post";
import { logger } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateStaticParams() {
	// Only generate static params if Sanity is configured
	if (
		!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
		!process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		return [];
	}

	try {
		const { client } = await import("@/sanity/lib/client");
		const { postPathsQuery } = await import("@/sanity/lib/queries");
		const posts = await client.fetch(postPathsQuery);
		return posts;
	} catch (error) {
		console.warn("Failed to generate static params for blog posts:", error);
		return [];
	}
}

export async function generateMetadata({ params }, parent) {
	const { slug } = await params;

	// Only fetch metadata if Sanity is configured
	if (
		!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
		!process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		return {
			title: "Blog Post",
			description: "Blog post not available",
		};
	}

	try {
		const { sanityFetch } = await import("@/sanity/lib/live");
		const { postQuery } = await import("@/sanity/lib/queries");
		const { client } = await import("@/sanity/lib/client");
		const imageUrlBuilder = (await import("@sanity/image-url")).default;

		const post = await sanityFetch({
			query: postQuery,
			params,
		});

		logger.info("Fetched Post:", post);

		if (!post) {
			logger.error(`Post not found. Slug: ${slug}`);
			return {};
		}

		const previousImages = (await parent).openGraph?.images || [];

		const builder = imageUrlBuilder(client);
		const imageUrl = post.mainImage
			? builder
					.image(post.mainImage)
					.auto("format")
					.fit("max")
					.width(1200)
					.height(630)
					.url()
			: undefined;
		const keywords = post.data.keywords?.split(",") || [];
		logger.info("Keywords:", keywords);

		return {
			title: post.data.title,
			description: post.data.description ?? "",
			alternates: { canonical: `/blog/post/${slug}` },
			openGraph: {
				images: imageUrl
					? [imageUrl, ...previousImages]
					: previousImages,
			},
			keywords: [...keywords, ...siteConfig.keywords, post.title],
		};
	} catch (error) {
		console.warn("Failed to generate metadata for blog post:", error);
		return {
			title: "Blog Post",
			description: "Blog post not available",
		};
	}
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
	// Only fetch post if Sanity is configured
	if (
		!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
		!process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		return <div>Blog post not available</div>;
	}

	try {
		const { sanityFetch } = await import("@/sanity/lib/live");
		const { postQuery } = await import("@/sanity/lib/queries");
		const post = await sanityFetch({ query: postQuery, params });
		return <Post post={post.data} />;
	} catch (error) {
		console.warn("Failed to fetch blog post:", error);
		return <div>Blog post not available</div>;
	}
}
