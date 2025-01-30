// import { format, parseISO } from "date-fns";
import { Prose } from "@/app/blog/components/Prose";
import { Card, CardContent } from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";

export function BlogPost(props) {
	const { date, title, author, content } = props;

	return (
		<PageWrapper>
			<article className="mx-auto max-w-2xl px-6 py-20">
				{/* <div className="text-center">
          <time dateTime={date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(date), "LLLL d, yyyy")}
          </time>
          <p className="text-sm font-semibold">by {author}</p>
        </div> */}
				<Card>
					<CardContent className="pt-6">
						<Prose className="prose-a:font-semibold prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline">
							{content}
						</Prose>
					</CardContent>
				</Card>
			</article>
		</PageWrapper>
	);
}
