"use client";

import DefaultTemplate from "@/components/templates/main/default-template";
import PortfolioNavbar from "@/components/templates/shared/navbar";
import { useState, useEffect } from "react";

export default function Page({ params }) {
	const { subdomain } = params;

	const [basics, setBasics] = useState({});
	const [experience, setExperience] = useState([]);
	const [education, setEducation] = useState([]);
	const [skill, setSkill] = useState([]);
	const [certification, setCertification] = useState([]);
	const [project, setProject] = useState([]);
	const [hackathon, setHackathon] = useState([]);
	const [profile, setProfile] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`/api/get-portfolio?username=${subdomain}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();

				// Dispatch actions to update Redux state
				if (data.profiles.success) setProfile(data.profiles.data);
				if (data.experiences.success)
					setExperience(data.experiences.data);
				if (data.educations.success) setEducation(data.educations.data);
				if (data.certifications.success)
					setCertification(data.certifications.data);
				if (data.skills.success) setSkill(data.skills.data);
				if (data.basics.success) setBasics(data.basics.data);
				if (data.projects.success) setProject(data.projects.data);
				if (data.hackathons.success) setHackathon(data.hackathons.data);
			} catch (error) {
				console.log("Error fetching or updating user data:", error);
			}
		};

		fetchData();
	}, [subdomain]);

	return (
		<div className="mx-auto h-full w-full max-w-3xl rounded-xl">
			<DefaultTemplate
				basics={basics}
				projects={project?.filter((item) => item.visible)}
				experiences={experience?.filter((item) => item.visible)}
				educations={education?.filter((item) => item.visible)}
				skills={skill?.filter((item) => item.visible)}
				hackathons={hackathon?.filter((item) => item.visible)}
				certifications={certification?.filter((item) => item.visible)}
			/>
			<PortfolioNavbar profile={profile} />
		</div>
	);
}
