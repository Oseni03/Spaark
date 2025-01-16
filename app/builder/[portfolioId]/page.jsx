"use client";

import DefaultTemplate from "@/components/templates/main/default-template";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Page({ params }) {
	const { portfolioId } = params;

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const basics = portfolio?.basics || {};
	const experience = portfolio?.experiences?.items || [];
	const education = portfolio?.educations?.items || [];
	const skill = portfolio?.skills?.items || [];
	const certification = portfolio?.certifications?.items || [];
	const project = portfolio?.projects?.items || [];
	const hackathon = portfolio?.hackathons?.items || [];
	const user = useSelector((state) => state.user);

	return (
		<div className="mx-auto h-full w-full max-w-3xl rounded-xl">
			{!user.subscribed && (
				<Alert className="mb-10 bg-blue-200 text-black">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Subscription</AlertTitle>
					<AlertDescription>
						You do not have an active subscription!{" "}
						<Link href={"/#pricing"}>
							<Button variant="link" className="text-black">
								Subscribe <ArrowRight />
							</Button>
						</Link>
					</AlertDescription>
				</Alert>
			)}

			<DefaultTemplate
				basics={basics}
				projects={project.filter((item) => item.visible)}
				experiences={experience.filter((item) => item.visible)}
				educations={education.filter((item) => item.visible)}
				skills={skill.filter((item) => item.visible)}
				hackathons={hackathon.filter((item) => item.visible)}
				certifications={certification.filter((item) => item.visible)}
			/>
		</div>
	);
}
