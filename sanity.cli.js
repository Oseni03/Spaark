/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";
import { projectId } from "./sanity/env";
import { dataset } from "./sanity/env";

// Check if required environment variables are set
let config;

if (!projectId || !dataset) {
	console.warn(
		"Missing required Sanity environment variables. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET"
	);
	// Return a minimal config that won't break the build
	config = defineCliConfig({
		api: {
			projectId: "dummy",
			dataset: "production",
		},
	});
} else {
	config = defineCliConfig({ api: { projectId, dataset } });
}

export default config;
