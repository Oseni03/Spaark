import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export function CertificationCard({ name, issuer, date, summary, url }) {
	return (
		<li className="relative ml-10 py-4 flex flex-col gap-4">
			<div className="flex flex-1 flex-col gap-1">
				{/* Date Display */}
				{date && (
					<time
						className="text-xs text-muted-foreground"
						dateTime={new Date(date).toISOString()}
					>
						{date}
					</time>
				)}

				{/* Certification Name */}
				<h2 className="text-base font-semibold leading-snug text-foreground">
					{name}
				</h2>

				{/* Issuer */}
				{issuer && (
					<p className="text-sm text-muted-foreground">
						Issued by {issuer}
					</p>
				)}

				{/* Summary */}
				{summary && (
					<p className="prose dark:prose-invert text-sm text-muted-foreground">
						{summary}
					</p>
				)}
			</div>

			{/* Source Link */}
			{url && (
				<Link href={url} target="_blank" rel="noopener noreferrer">
					<Badge className="inline-flex items-center gap-2 px-2 py-1 text-sm">
						<Globe className="h-4 w-4" />
						Source
					</Badge>
				</Link>
			)}
		</li>
	);
}
