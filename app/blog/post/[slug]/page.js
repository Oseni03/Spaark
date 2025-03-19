import { sanityFetch } from "@/sanity/lib/live";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Post } from "./Post";
import { logger } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateStaticParams() {
	const posts = await client.fetch(postPathsQuery);
	return posts;
}

export async function generateMetadata({ params }, parent) {
	const { slug } = await params;
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
			images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
		},
		keywords: [...keywords, ...siteConfig.keywords, post.title],
	};
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
	const post = await sanityFetch({ query: postQuery, params });

	return <Post post={post.data} />;
}
