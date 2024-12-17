import { notFound } from "next/navigation";
import { z } from "zod";

import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import DataWrapper from "@/components/wrapper/data-wrapper";
import { getUserByUsername } from "@/services/user";

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

		if (!userResult.success || !userResult.data) {
			return notFound();
		}

		return (
			<div className={PORTFOLIO_TAILWIND_CLASS}>
				<DataWrapper subdomain={subdomain}>{children}</DataWrapper>
			</div>
		);
	} catch (error) {
		console.error(`Error loading user layout for ${subdomain}:`, error);
		return notFound();
	}
}

export async function generateMetadata({ params }) {
	// Validate input using Zod
	const validationResult = ParamsSchema.safeParse(params);

	if (!validationResult.success) {
		return {
			title: "User Not Found",
			description: "This user profile does not exist",
		};
	}

	const { subdomain } = validationResult.data;

	try {
		const userResult = await getUserByUsername(subdomain);

		if (!userResult.success || !userResult.data) {
			return {
				title: "User Not Found",
				description: "This user profile does not exist",
			};
		}

		const name = userResult.data.basics?.name || subdomain;

		return {
			title: `${name}'s Portfolio`,
			description: `Portfolio page for ${name}`,
			openGraph: {
				title: `${name}'s Portfolio`,
				description: `Portfolio page for ${name}`,
				type: "profile",
			},
			twitter: {
				card: "summary",
				title: `${name}'s Portfolio`,
				description: `Portfolio page for ${name}`,
			},
		};
	} catch (error) {
		console.error(`Error generating metadata for ${subdomain}:`, error);

		return {
			title: "User Not Found",
			description: "This user profile does not exist",
		};
	}
}

// Optional: Revalidation configuration
export const revalidate = 3600; // Revalidate every hour
