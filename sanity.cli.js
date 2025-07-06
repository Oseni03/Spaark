/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Check if required environment variables are set
if (!projectId || !dataset) {
	throw new Error(
		"Missing required Sanity environment variables. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET"
	);
}

export default defineCliConfig({ api: { projectId, dataset } });
