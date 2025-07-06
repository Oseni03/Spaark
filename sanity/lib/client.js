import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Check if required environment variables are set
if (!projectId || !dataset) {
	throw new Error(
		"Missing required Sanity environment variables. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET"
	);
}

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});
