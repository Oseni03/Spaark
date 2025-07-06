/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from "next-sanity/studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
	// Only render studio if Sanity is configured
	if (
		!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
		!process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Sanity Studio Not Available
					</h1>
					<p className="text-gray-600">
						Please configure Sanity environment variables to access
						the studio.
					</p>
				</div>
			</div>
		);
	}

	try {
		const config = require("../../../sanity.config").default;
		return <NextStudio config={config} />;
	} catch (error) {
		console.warn("Failed to load Sanity config:", error);
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Sanity Studio Error
					</h1>
					<p className="text-gray-600">
						Failed to load Sanity Studio configuration.
					</p>
				</div>
			</div>
		);
	}
}
