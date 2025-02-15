import Image from "next/image";
import Link from "next/link";
import { BlogWrapper } from "@/components/wrapper/blog-wrapper";
import { sanityFetch } from "@/sanity/lib/live";
import { postsQuery } from "@/sanity/lib/queries";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 60;

export default async function BlogContentsPage() {
	const posts = await sanityFetch({ query: postsQuery });

	console.log("Fetched posts:", posts);

	return (
		<BlogWrapper>
			<Posts posts={posts.data} />
		</BlogWrapper>
	);
}

function Posts({ posts = [] }) {
	if (!Array.isArray(posts)) {
		console.error("Posts is not an array:", posts);
		return <div>No posts available</div>;
	}

	const allPosts = posts.map((post) => ({
		title: post.title,
		file: post.slug.current,
		description: post.description ?? "",
		date: new Date(post._createdAt).toLocaleDateString(),
		datetime: post._createdAt,
		author: {
			name: post.authorName,
			role: "Founder",
			href: "#",
			imageUrl: "/images/blog/elie-profile.jpg",
		},
		imageUrl: post.imageURL ?? "/images/reach-inbox-zero.png",
	}));

	return (
		<div className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
					From the blog
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{allPosts.map((post) => (
						<PostCard key={post.title} post={post} />
					))}
				</div>
			</div>
		</div>
	);
}

function PostCard({ post }) {
	return (
		<Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
			<Link href={`/blog/post/${post.file}`}>
				<div className="relative h-48 w-full">
					<Image
						src={post.imageUrl}
						alt={post.title}
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<CardContent className="pt-4">
					<h3 className="mb-2 font-cal text-lg leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-100 dark:group-hover:text-gray-300">
						{post.title}
					</h3>
					<p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
						{post.description}
					</p>
					<div className="flex items-center gap-x-4">
						<Image
							src={post.author.imageUrl}
							alt={post.title}
							className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800"
							width={32}
							height={32}
						/>
						<div className="text-sm">
							<p className="font-semibold text-gray-900 dark:text-gray-100">
								{post.author.name}
							</p>
							<time
								dateTime={post.datetime}
								className="text-gray-500"
							>
								{post.date}
							</time>
						</div>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}
