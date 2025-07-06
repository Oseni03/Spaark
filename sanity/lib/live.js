// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity";

// Only create client if environment variables are configured
let client = null;
try {
	const { client: sanityClient } = require("./client");
	client = sanityClient;
} catch (error) {
	console.warn("Sanity not configured, live content will not be available");
}

export const { sanityFetch, SanityLive } = client
	? defineLive({
			client: client.withConfig({
				// Live content is currently only available on the experimental API
				// https://www.sanity.io/docs/api-versioning
				apiVersion: "vX",
			}),
		})
	: {
			sanityFetch: async () => [],
			SanityLive: () => null,
		};
