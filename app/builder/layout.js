"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCertifications } from "@/redux/features/certificationSlice";
import { setEducations } from "@/redux/features/educationSlice";
import { setExperience } from "@/redux/features/experienceSlice";
import { setProfiles } from "@/redux/features/profileSlice";
import { setSkills } from "@/redux/features/skillSlice";
import { updateBasics } from "@/redux/features/basicSlice";
import { setProjects } from "@/redux/features/projectSlice";

const BuilderLayout = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/get-portfolio`);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();

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
					dispatch(setProjects(data.hackathons.data));
			} catch (error) {
				console.log("Error fetching or updating user data:", error);
			}
		};

		fetchData();
	}, [dispatch]);

	return <>{children}</>;
};

export default BuilderLayout;
