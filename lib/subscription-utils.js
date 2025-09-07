"use server";

import {
	getUserLivePortfoliosCount,
	getUserPublishedArticlesCount,
} from "@/services/subscription";
import { auth } from "./auth";

export async function canMakePortfolioLive(userId) {
	const { user } = await auth.api.getSession();
	if (user.id !== userId) return false;
	const limit = user.subscription.portfolioLimit || 1;
	const count = await getUserLivePortfoliosCount(userId);
	return count < limit;
}

export async function canEnableBlog(userId) {
	const { user } = await auth.api.getSession();
	if (user.id !== userId) return false;
	return user.subscription.blogEnabled;
}

export async function canWriteArticle(userId) {
	const { user } = await auth.api.getSession();
	if (user.id !== userId) return false;
	const limit = user.subscription.blogLimit;
	const count = await getUserPublishedArticlesCount(userId);
	return user.subscription.blogEnabled && count < limit;
}
