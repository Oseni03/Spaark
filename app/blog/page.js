import Image from "next/image";
import Link from "next/link";
import { BlogWrapper } from "@/components/wrapper/blog-wrapper";

export const revalidate = 60;

export default async function BlogContentsPage() {
	// Only fetch posts if Sanity is configured
	if (
		!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
		!process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		return (
			<BlogWrapper>
				<div className="py-16 sm:py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
							From the blog
						</h2>
						<div className="text-center text-gray-500">
							Blog posts are not available at the moment.
						</div>
					</div>
				</div>
			</BlogWrapper>
		);
	}

	try {
		const { sanityFetch } = await import("@/sanity/lib/live");
		const { postsQuery } = await import("@/sanity/lib/queries");
		const posts = await sanityFetch({ query: postsQuery });

		console.log("Fetched posts:", posts);

		return (
			<BlogWrapper>
				<Posts posts={posts.data} />
			</BlogWrapper>
		);
	} catch (error) {
		console.warn("Failed to fetch blog posts:", error);
		return (
			<BlogWrapper>
				<div className="py-16 sm:py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
							From the blog
						</h2>
						<div className="text-center text-gray-500">
							Failed to load blog posts.
						</div>
					</div>
				</div>
			</BlogWrapper>
		);
	}
}

function Posts({ posts = [] }) {
	if (!Array.isArray(posts)) {
		console.error("Posts is not an array:", posts);
		return <div>No posts available</div>;
	}

	const allPosts = posts.map((post) => ({
		title: post.title,
		file: post.slug.current,
		date: new Date(post._createdAt).toLocaleDateString(),
		datetime: post._createdAt,
	}));

	return (
		<div className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
					From the blog
				</h2>
				<div className="divide-y divide-gray-200 dark:divide-gray-700">
					{allPosts.map((post) => (
						<Link
							key={post.title}
							href={`/blog/post/${post.file}`}
							className="block py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
								{post.title}
							</h3>
							<time
								dateTime={post.datetime}
								className="text-sm text-gray-500"
							>
								{post.date}
							</time>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
