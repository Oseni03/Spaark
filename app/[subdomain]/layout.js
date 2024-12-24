import { notFound } from "next/navigation";
import { z } from "zod";

import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import DataWrapper from "@/components/wrapper/data-wrapper";
import { getUserByUsername } from "@/services/user";
import { isTrialing } from "@/lib/utils";

// Input validation schema
const ParamsSchema = z.object({
	subdomain: z.string().min(1, "Subdomain is required"),
});

export default async function UserLayout({ params, children }) {
	// Validate input using Zod
	const validationResult = ParamsSchema.safeParse(params);

	if (!validationResult.success) {
		return notFound();
	}

	const { subdomain } = validationResult.data;

	try {
		const userResult = await getUserByUsername(subdomain);

		const user = userResult?.data;

		if (
			!userResult.success ||
			!user ||
			(!user.subscribed && !isTrialing(user.createdAt))
		) {
			return notFound();
		}

		const name = user.basics?.name || subdomain;
		const headline = user.basics?.headline;
		const picture = user.basics?.picture;
		const summary = user.basics?.summary;

		return (
			<>
				<head>
					<title>
						{name} - {headline}
					</title>
					<meta name="site_name" content={name} />
					<meta name="description" content={summary} />
					<meta
						property="og:title"
						content={`${name} - ${headline}`}
					/>
					<meta property="og:description" content={summary} />
					<meta property="og:type" content="profile" />
					<meta property="og:username" content={subdomain} />
					<meta name="twitter:card" content={summary} />
					<meta
						name="twitter:title"
						content={`${name} - ${headline}`}
					/>
					<meta name="twitter:description" content={summary} />
					{picture && <meta name="image" content={picture} />}
					<meta
						name="url"
						content={
							subdomain +
							"." +
							process.env.NEXT_PUBLIC_ROOT_DOMAIN
						}
					></meta>
				</head>
				<div className={PORTFOLIO_TAILWIND_CLASS}>
					<DataWrapper subdomain={subdomain}>{children}</DataWrapper>
				</div>
			</>
		);
	} catch (error) {
		console.error(`Error loading user layout for ${subdomain}:`, error);
		return notFound();
	}
}
