import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import { notFound } from "next/navigation";
import DataWrapper from "@/components/wrapper/data-wrapper";
import { getUserByUsername } from "@/services/user";

export default async function UserLayout({ params, children }) {
	const { subdomain } = await params;

	// Validate input
	if (!subdomain) {
		return notFound();
	}

	return (
		<div className={PORTFOLIO_TAILWIND_CLASS}>
			<DataWrapper subdomain={subdomain}>{children}</DataWrapper>
		</div>
	);
}

export async function generateMetadata({ params }) {
	const { subdomain } = await params;

	// Validate input
	if (!subdomain) {
		return {
			title: "User Not Found",
			description: "This user profile does not exist",
		};
	}

	const user = await getUserByUsername(subdomain);
	console.log("Metadata user: ", user);

	if (!user.success) {
		return {
			title: "User Not Found",
			description: "This user profile does not exist",
		};
	}
	const name = user.data?.basics?.name || subdomain;

	return {
		title: `${name}'s Portfolio`,
		description: `Portfolio page for ${name}`,
	};
}
