import { BlogWrapper } from "@/components/wrapper/blog-wrapper";
import { getPosts } from "@/sanity/lib/client";
import Container from "@/components/blog/container";
import Link from "next/link";
import { parseISO, format } from "date-fns";

export const revalidate = 60;

export default async function BlogContentsPage() {
	try {
		const posts = await getPosts();

		console.log("Fetched posts:", posts);

		return (
			<BlogWrapper>
				<Posts posts={posts} />
			</BlogWrapper>
		);
	} catch (error) {
		console.warn("Failed to fetch blog posts:", error);
		return (
			<BlogWrapper>
				<Container>
					<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
						From the blog
					</h2>
					<div className="text-center text-gray-500">
						Blog posts are not available at the moment.
					</div>
				</Container>
			</BlogWrapper>
		);
	}
}

function Posts({ posts = [] }) {
	if (!Array.isArray(posts)) {
		console.error("Posts is not an array:", posts);
		return <div>No posts available</div>;
	}

	return (
		<div className="py-16 sm:py-24">
			<div className="mx-auto max-w-full px-6">
				<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
					From the blog
				</h2>
				<div className="divide-y divide-gray-200 dark:divide-gray-700">
					{posts.map((post) => (
						<Link
							key={post.title}
							href={`/blog/post/${post.slug.current}`}
							className="block py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
								{post.title}
							</h3>
							<time
								className="truncate text-sm"
								dateTime={post?.publishedAt || post._createdAt}
							>
								{format(
									parseISO(
										post?.publishedAt || post._createdAt
									),
									"MMMM dd, yyyy"
								)}
							</time>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
