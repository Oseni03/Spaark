import { sanityFetch } from "@/sanity/lib/live";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Post } from "@/app/blog/post/[slug]/Post";
import { logger } from "@/lib/utils";

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
	const keywords = post?.keywords.split(",").map(kw => kw.trim());

	return {
		title: post.title,
		description: post.description ?? "",
		alternates: { canonical: `/blog/post/${slug}` },
		openGraph: {
			images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
		},
		keywords: [...keywords, post.title]
	};
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
	const post = await sanityFetch({ query: postQuery, params });

	return <Post post={post.data} />;
}
