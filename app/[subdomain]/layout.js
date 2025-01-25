import React from "react";
import { z } from "zod";
import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import { getUserByUsername } from "@/services/user";
import { isTrialing } from "@/lib/utils";
import { UserProvider } from "@/context/UserContext";
import { logger } from "@/lib/utils";
import NotFound from "../not-found";
import { cn } from "@/lib/utils";

// Input validation schema
const ParamsSchema = z.object({
	subdomain: z.string().min(1, "Subdomain is required"),
});

export default async function UserLayout({ params, children }) {
	// Ensure params is not a promise
	const paramsData = await Promise.resolve(params);

	// Validate input using Zod
	const validationResult = ParamsSchema.safeParse(paramsData);

	if (!validationResult.success) {
		logger.error("Subdomain validation error: ", validationResult.error);
		return NotFound();
	}

	const { subdomain } = validationResult.data;
	logger.info("Validated subdomain: ", subdomain);

	try {
		// Fetch user by subdomain
		const userResult = await getUserByUsername(subdomain);
		logger.info("Subdomain profile result: ", userResult);

		const user = userResult?.data;

		// Check for invalid user, subscription, or trialing status
		if (
			!userResult.success ||
			!user
			//|| (!user.subscribed && !isTrialing(user.createdAt))
		) {
			return NotFound();
		}

		// Extract user details
		const name = user.basics?.name || subdomain;
		const headline = user.basics?.headline;
		const picture = user.basics?.picture || null;
		const summary = user.basics?.summary || "Welcome to my profile!";

		// Meta tags
		const metaTags = {
			title: `${name} - ${headline}`,
			description: summary,
			image: picture,
			url: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		};

		return (
			<>
				<head>
					<title>{metaTags.title}</title>
					<meta name="description" content={metaTags.description} />
					<meta property="og:title" content={metaTags.title} />
					<meta
						property="og:description"
						content={metaTags.description}
					/>
					<meta property="og:type" content="profile" />
					<meta property="og:username" content={subdomain} />
					<meta name="twitter:card" content={summary} />
					<meta
						name="twitter:title"
						content={`${name} - ${headline}`}
					/>
					<meta name="twitter:description" content={summary} />

					{metaTags.image && (
						<meta property="og:image" content={metaTags.image} />
					)}
					<meta name="url" content={metaTags.url} />
				</head>
				<body
					className={cn(PORTFOLIO_TAILWIND_CLASS, "scrollbar-hide")}
				>
					<UserProvider user={user} metaTags={metaTags}>
						{children}
					</UserProvider>
				</body>
			</>
		);
	} catch (error) {
		logger.error(`Error loading user layout for ${subdomain}:`, error);
		return NotFound();
	}
}
