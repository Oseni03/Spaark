import Container from "./container";
import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";

export default function ClientPost({
	title,
	author,
	featuredImage,
	excerpt,
	date,
	content,
}) {
	return (
		<>
			<Container className="!pt-0">
				<div className="mx-auto max-w-screen-md ">
					<h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
						{title}
					</h1>
					<div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
						<div className="flex items-center gap-3">
							{author.image && (
								<div className="relative h-10 w-10 flex-shrink-0">
									<Image
										src={author.image}
										alt={author.name}
										className="rounded-full object-cover"
										fill
										sizes="40px"
									/>
								</div>
							)}
							<div>
								<p className="text-gray-800 dark:text-gray-400">
									{author?.name}
								</p>
								<div className="flex items-center space-x-2 text-sm">
									<time
										className="text-gray-500 dark:text-gray-400"
										dateTime={date}
									>
										{format(
											parseISO(date),
											"MMMM dd, yyyy"
										)}
									</time>
									<span>· {"5"} min read</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
			<div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
				{featuredImage && (
					<Image
						src={featuredImage}
						alt={title}
						loading="eager"
						fill
						sizes="100vw"
						className="object-cover"
					/>
				)}
			</div>
			<Container>
				<article className="mx-auto max-w-screen-md ">
					<div
						className="prose mx-auto my-3 dark:prose-invert prose-a:text-blue-600"
						dangerouslySetInnerHTML={{ __html: content }}
					/>
					<div className="mb-7 mt-7 flex justify-center">
						<Link
							href="/blog"
							className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 "
						>
							← View all posts
						</Link>
					</div>
				</article>
			</Container>
		</>
	);
}
