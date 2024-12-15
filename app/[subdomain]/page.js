"use client";

import DefaultTemplate from "@/components/templates/main/default-template";
import PortfolioNavbar from "@/components/templates/shared/navbar";
import { useSelector } from "react-redux";

export default function Page() {
	const basics = useSelector((state) => state.basics);
	const experience = useSelector((state) => state.experience);
	const education = useSelector((state) => state.education);
	const skill = useSelector((state) => state.skill);
	const certification = useSelector((state) => state.certification);
	const project = useSelector((state) => state.project);
	const hackathon = useSelector((state) => state.hackathon);
	return (
		<div className="mx-auto h-full w-full max-w-3xl rounded-xl">
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
			<PortfolioNavbar />
		</div>
	);
}
