"use client";

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\app\app\studio\[[...tool]]\page.jsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { siteConfig } from "./config/site";

// Check if required environment variables are set
if (!projectId || !dataset) {
	throw new Error(
		"Missing required Sanity environment variables. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET"
	);
}

export default defineConfig({
	basePath: "/studio",
	name: `${siteConfig.name}_Content_Studio`,
	title: `${siteConfig.name} Content Studio`,
	projectId,
	dataset,
	// Add and edit the content schema in the './sanity/schemaTypes' folder
	schema,
	plugins: [
		structureTool({ structure }),
		// Vision is for querying with GROQ from inside the Studio
		// https://www.sanity.io/docs/the-vision-plugin
		visionTool({ defaultApiVersion: apiVersion }),
	],
});
