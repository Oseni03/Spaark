"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setCertifications } from "@/redux/features/certificationSlice";
import { setEducations } from "@/redux/features/educationSlice";
import { setExperience } from "@/redux/features/experienceSlice";
import { setProfiles } from "@/redux/features/profileSlice";
import { setSkills } from "@/redux/features/skillSlice";
import { updateBasics } from "@/redux/features/basicSlice";
import { setProjects } from "@/redux/features/projectSlice";
import { setHackathons } from "@/redux/features/hackathonSlice";

export default function DataWrapper({ subdomain, children }) {
	const dispatch = useDispatch();

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
				console.log("Portfolio resp: ", data);

				// Dispatch actions to update Redux state
				if (data.profiles.success)
					dispatch(setProfiles(data.profiles.data));
				if (data.experiences.success)
					dispatch(setExperience(data.experiences.data));
				if (data.educations.success)
					dispatch(setEducations(data.educations.data));
				if (data.certifications.success)
					dispatch(setCertifications(data.certifications.data));
				if (data.skills.success) dispatch(setSkills(data.skills.data));
				if (data.basics.success)
					dispatch(updateBasics(data.basics.data));
				if (data.projects.success)
					dispatch(setProjects(data.projects.data));
				if (data.hackathons.success)
					dispatch(setHackathons(data.hackathons.data));
			} catch (error) {
				console.log("Error fetching or updating user data:", error);
			}
		};

		fetchData();
	}, [dispatch, subdomain]);
	return <>{children}</>;
}
