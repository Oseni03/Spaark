import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export const BlogPost = ({
	title,
	author,
	featuredImage,
	excerpt,
	date,
	content,
}) => {
	return (
		<article className="max-w-4xl mx-auto px-6 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-6">{title}</h1>
				{featuredImage && (
					<div className="mt-6 aspect-video w-full">
						<img
							src={featuredImage}
							alt={title}
							className="w-full h-full object-cover rounded-lg"
						/>
					</div>
				)}
			</div>

			<div className="mb-4">
				<div className="flex flex-col gap-3">
					<span className="text-gray-600 dark:text-gray-400">
						{date}
					</span>
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={author.image} alt={author.name} />
							<AvatarFallback>
								{getInitials(author.name)}
							</AvatarFallback>
						</Avatar>
						<span className="font-semibold">{author.name}</span>
					</div>
				</div>
			</div>

			<div className="prose prose-lg max-w-3xl dark:prose-invert mb-8 mx-auto">
				<p className="text-gray-600 dark:text-gray-400">{excerpt}</p>
			</div>

			<div
				className="prose prose-lg max-w-none dark:prose-invert"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</article>
	);
};
