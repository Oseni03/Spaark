import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<>
			<main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<Badge className="text-base font-semibold">404</Badge>
					<h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
						Page not found
					</h1>
					<p className="mt-6 text-pretty text-lg font-medium sm:text-xl/8">
						Sorry, we couldn&rsquo;t find the page you&rsquo;re
						looking for.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Button size="sm">
							<Link href={process.env.NEXT_PUBLIC_APP_URL}>
								Go back home
							</Link>
						</Button>
						<Button
							size="sm"
							variant="link"
							className="text-sm font-semibold"
						>
							<Link
								href={`${process.env.NEXT_PUBLIC_APP_URL}/contact-us`}
							>
								Contact support{" "}
								<span aria-hidden="true">&rarr;</span>
							</Link>
						</Button>
					</div>
				</div>
			</main>
		</>
	);
}
