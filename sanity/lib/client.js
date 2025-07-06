import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";
import {
	postPathsQuery,
	postQuery,
	postSlugsQuery,
	postsQuery,
	recentPostsQuery,
} from "./queries";

// Check if required environment variables are set
const client = projectId
	? createClient({ projectId, dataset, apiVersion, useCdn: true })
	: null;

export { client };

export async function getRecentPost() {
	if (client) {
		return (await client.fetch(recentPostsQuery, { tags: ["post"] })) || [];
	}
	return [];
}

export async function getPosts() {
	if (client) {
		return (await client.fetch(postsQuery)) || [];
	}
	return [];
}

export async function getPost(params) {
	if (client) {
		return (await client.fetch(postQuery, params)) || {};
	}
	return {};
}

export async function getPostPaths() {
	if (client) {
		return (await client.fetch(postPathsQuery)) || [];
	}
	return [];
}

export async function getAllPostsSlugs() {
	if (client) {
		const slugs = (await client.fetch(postSlugsQuery)) || [];
		return slugs.map((slug) => ({ slug }));
	}
	return [];
}
