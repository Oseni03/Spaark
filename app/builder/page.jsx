"use client";

import DefaultTemplate from "@/components/templates/main/default-template";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Page() {
	const basics = useSelector((state) => state.basics);
	const user = useSelector((state) => state.user);
	const experience = useSelector((state) => state.experience);
	const education = useSelector((state) => state.education);
	const skill = useSelector((state) => state.skill);
	const certification = useSelector((state) => state.certification);
	const project = useSelector((state) => state.project);
	const hackathon = useSelector((state) => state.hackathon);
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
				projects={project.items.filter((item) => item.visible)}
				experiences={experience.items.filter((item) => item.visible)}
				educations={education.items.filter((item) => item.visible)}
				skills={skill.items.filter((item) => item.visible)}
				hackathons={hackathon.items.filter((item) => item.visible)}
				certifications={certification.items.filter(
					(item) => item.visible
				)}
			/>
		</div>
	);
}
