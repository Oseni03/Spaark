"use client";

import DefaultTemplate from "@/components/templates/main/default-template";
import { useSelector } from "react-redux";

export default function Page() {
	const basics = useSelector((state) => state.basics);
	const profile = useSelector((state) => state.profile);
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
				projects={project}
				experiences={experience}
				educations={education}
				skills={skill}
				hackathons={hackathon}
			/>
		</div>
	);
}
