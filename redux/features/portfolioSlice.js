import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	defaultExperience,
	defaultHackathon,
	defaultSections,
	defaultCertification,
	certificationSchema,
	experienceSchema,
	defaultEducation,
	educationSchema,
	hackathonSchema,
	projectSchema,
	defaultProject,
	skillSchema,
	defaultSkill,
} from "@/schema/sections";
import { defaultBasics } from "@/schema/basics";
import { updateBasicsInDatabase } from "../thunks/basics";
import {
	addCertificationInDatabase,
	updateCertificationnInDatabase,
	removeCertificationFromDatabase,
} from "../thunks/certifications";
import {
	addEducationInDatabase,
	updateEducationInDatabase,
	removeEducationFromDatabase,
} from "../thunks/educations";
import {
	addExperienceInDatabase,
	updateExperienceInDatabase,
	removeExperienceFromDatabase,
} from "../thunks/experience";
import {
	addHackathonInDatabase,
	updateHackathonnInDatabase,
	removeHackathonFromDatabase,
} from "../thunks/hackathon";
import {
	addProjectInDatabase,
	updateProjectInDatabase,
	removeProjectFromDatabase,
} from "../thunks/project";
import {
	addSkillInDatabase,
	updateSkillnInDatabase,
	removeSkillFromDatabase,
} from "../thunks/skill";
import { logger } from "@/lib/utils";

// Initial State
const initialState = {
	items: [], // Array of portfolios with unique IDs
	loading: false,
	error: null,
};

// Portfolio Slice
const portfolioSlice = createSlice({
	name: "portfolio",
	initialState,
	reducers: {
		updateBasics(state, action) {
			const { portfolioId, basics } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.basics = { ...portfolio.basics, ...basics };
			}
		},
		resetBasics(state, action) {
			const { portfolioId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.basics = defaultBasics; // Reset to default basics
			}
		},
		setCertifications(state, action) {
			const { portfolioId, certifications } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.certifications.items = certifications;
			}
		},
		addCertification(state, action) {
			const { portfolioId, certification } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = certificationSchema.safeParse(certification);
				if (result.success) {
					portfolio.certifications.items.push({
						...defaultCertification,
						...result.data,
					});
				} else {
					logger.error("Invalid certification data:", result.error);
				}
			}
		},
		updateCertification(state, action) {
			const { portfolioId, certification } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.certifications.items.findIndex(
					(item) => item.id === certification.id
				);
				if (index !== -1) {
					const result = certificationSchema.safeParse(certification);
					if (result.success) {
						portfolio.certifications.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeCertification(state, action) {
			const { portfolioId, certificationId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.certifications.items =
					portfolio.certifications.items.filter(
						(item) => item.id !== certificationId
					);
			}
		},
		toggleCertificationVisibility(state, action) {
			const { portfolioId, certificationId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const certification = portfolio.certifications.items.find(
					(item) => item.id === certificationId
				);
				if (certification) {
					certification.visible = !certification.visible;
				}
			}
		},
		// Education Reducers
		setEducations(state, action) {
			const { portfolioId, educations } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.educations.items = educations;
			}
		},
		addEducation(state, action) {
			const { portfolioId, education } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = educationSchema.safeParse(education);
				if (result.success) {
					portfolio.educations.items.push({
						...defaultEducation,
						...result.data,
					});
				} else {
					logger.error("Invalid education data:", result.error);
				}
			}
		},
		updateEducation(state, action) {
			const { portfolioId, education } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.educations.items.findIndex(
					(item) => item.id === education.id
				);
				if (index !== -1) {
					const result = educationSchema.safeParse(education);
					if (result.success) {
						portfolio.educations.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeEducation(state, action) {
			const { portfolioId, educationId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.educations.items = portfolio.educations.items.filter(
					(item) => item.id !== educationId
				);
			}
		},
		toggleEducationVisibility(state, action) {
			const { portfolioId, educationId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const education = portfolio.educations.items.find(
					(item) => item.id === educationId
				);
				if (education) {
					education.visible = !education.visible;
				}
			}
		},

		// Experience Reducers
		setExperience(state, action) {
			const { portfolioId, experiences } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.experiences.items = experiences;
			}
		},
		addExperience(state, action) {
			const { portfolioId, experience } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = experienceSchema.safeParse(experience);
				if (result.success) {
					portfolio.experiences.items.push(
						...defaultExperience,
						...result.data
					);
				} else {
					logger.error("Invalid experience data:", result.error);
				}
			}
		},
		updateExperience(state, action) {
			const { portfolioId, experience } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.experiences.items.findIndex(
					(item) => item.id === experience.id
				);
				if (index !== -1) {
					const result = experienceSchema.safeParse(experience);
					if (result.success) {
						portfolio.experiences.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeExperience(state, action) {
			const { portfolioId, experienceId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.experiences.items =
					portfolio.experiences.items.filter(
						(item) => item.id !== experienceId
					);
			}
		},
		toggleExperienceVisibility(state, action) {
			const { portfolioId, experienceId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const experience = portfolio.experiences.items.find(
					(item) => item.id === experienceId
				);
				if (experience) {
					experience.visible = !experience.visible;
				}
			}
		},

		// Hackathon Reducers
		setHackathons(state, action) {
			const { portfolioId, hackathons } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.hackathons.items = hackathons;
			}
		},
		addHackathon(state, action) {
			const { portfolioId, hackathon } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = hackathonSchema.safeParse(hackathon);
				if (result.success) {
					portfolio.hackathons.items.push(
						...defaultHackathon,
						...result.data
					);
				} else {
					logger.error("Invalid hackathon data:", result.error);
				}
			}
		},
		updateHackathon(state, action) {
			const { portfolioId, hackathon } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.hackathons.items.findIndex(
					(item) => item.id === hackathon.id
				);
				if (index !== -1) {
					const result = hackathonSchema.safeParse(hackathon);
					if (result.success) {
						portfolio.hackathons.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeHackathon(state, action) {
			const { portfolioId, hackathonId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.hackathons.items = portfolio.hackathons.items.filter(
					(item) => item.id !== hackathonId
				);
			}
		},
		toggleHackathonVisibility(state, action) {
			const { portfolioId, hackathonId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const hackathon = portfolio.hackathons.items.find(
					(item) => item.id === hackathonId
				);
				if (hackathon) {
					hackathon.visible = !hackathon.visible;
				}
			}
		},

		// Profile Reducers
		setProfiles(state, action) {
			const { portfolioId, profiles } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.profiles.items = profiles;
			}
		},
		addProfile(state, action) {
			const { portfolioId, profile } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = profileSchema.safeParse(profile);
				if (result.success) {
					const newProfile = result.data;

					// Check for duplicates
					const existingProfile = portfolio.profiles.items.find(
						(item) => item.network === newProfile.network
					);
					if (existingProfile) {
						toast.info(
							"Profile with the same network already exists"
						);
						return;
					}

					portfolio.profiles.items.push(newProfile);
				}
			}
		},
		updateProfile(state, action) {
			const { portfolioId, profile } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.profiles.items.findIndex(
					(item) => item.id === profile.id
				);
				if (index !== -1) {
					const result = profileSchema.safeParse(profile);
					if (result.success) {
						portfolio.profiles.items[index] = result.data;
					}
				}
			}
		},
		removeProfile(state, action) {
			const { portfolioId, profileId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.profiles.items = portfolio.profiles.items.filter(
					(item) => item.id !== profileId
				);
			}
		},
		toggleProfileVisibility(state, action) {
			const { portfolioId, profileId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const profile = portfolio.profiles.items.find(
					(item) => item.id === profileId
				);
				if (profile) {
					profile.visible = !profile.visible;
				}
			}
		},
		// Project Reducers
		setProjects(state, action) {
			const { portfolioId, projects } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.projects.items = projects;
			}
		},
		addProject(state, action) {
			const { portfolioId, project } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = projectSchema.safeParse(project);
				if (result.success) {
					portfolio.projects.items.push(
						...defaultProject,
						...result.data
					);
				} else {
					logger.error("Invalid project data:", result.error);
				}
			}
		},
		updateProject(state, action) {
			const { portfolioId, project } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.projects.items.findIndex(
					(item) => item.id === project.id
				);
				if (index !== -1) {
					const result = projectSchema.safeParse(project);
					if (result.success) {
						portfolio.projects.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeProject(state, action) {
			const { portfolioId, projectId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.projects.items = portfolio.projects.items.filter(
					(item) => item.id !== projectId
				);
			}
		},
		toggleProjectVisibility(state, action) {
			const { portfolioId, projectId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const project = portfolio.projects.items.find(
					(item) => item.id === projectId
				);
				if (project) {
					project.visible = !project.visible;
				}
			}
		},
		// Skill Reducers
		setSkills(state, action) {
			const { portfolioId, skills } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.skills.items = skills;
			}
		},
		addSkill(state, action) {
			const { portfolioId, skill } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const result = skillSchema.safeParse(skill);
				if (result.success) {
					portfolio.skills.items.push(
						...defaultSkill,
						...result.data
					);
				} else {
					logger.error("Invalid skill data:", result.error);
				}
			}
		},
		updateSkill(state, action) {
			const { portfolioId, skill } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.skills.items.findIndex(
					(item) => item.id === skill.id
				);
				if (index !== -1) {
					const result = skillSchema.safeParse(skill);
					if (result.success) {
						portfolio.skills.items[index] = result.data;
					} else {
						logger.error("Invalid update data:", result.error);
					}
				}
			}
		},
		removeSkill(state, action) {
			const { portfolioId, skillId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				portfolio.skills.items = portfolio.skills.items.filter(
					(item) => item.id !== skillId
				);
			}
		},
		toggleSkillVisibility(state, action) {
			const { portfolioId, skillId } = action.payload;
			const portfolio = state.items.find(
				(portfolio) => portfolio.id === portfolioId
			);
			if (portfolio) {
				const skill = portfolio.skills.items.find(
					(item) => item.id === skillId
				);
				if (skill) {
					skill.visible = !skill.visible;
				}
			}
		},
	},
	extraReducers: (builder) => {
		// Basics Extra Reducers
		builder
			.addCase(updateBasicsInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.status = "loading";
				}
			})
			.addCase(updateBasicsInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.status = "succeeded";
					portfolio.basics = {
						...portfolio.basics,
						...action.payload,
					};
				}
			})
			.addCase(updateBasicsInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.status = "failed";
					portfolio.error = action.payload;
				}
			});

		// Certification Extra Reducers
		builder
			.addCase(addCertificationInDatabase.pending, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addCertificationInDatabase.fulfilled, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addCertificationInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to add certification";
				}
			})
			.addCase(updateCertificationnInDatabase.pending, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateCertificationnInDatabase.fulfilled, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(
				updateCertificationnInDatabase.rejected,
				(state, action) => {
					const { portfolioId } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						portfolio.loading = false;
						portfolio.error =
							action.payload || "Failed to update certification";
					}
				}
			)
			.addCase(removeCertificationFromDatabase.pending, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeCertificationFromDatabase.fulfilled, (state) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(
				removeCertificationFromDatabase.rejected,
				(state, action) => {
					const { portfolioId } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						portfolio.loading = false;
						portfolio.error =
							action.payload || "Failed to remove certification";
					}
				}
			);

		// Education Extra Reducers
		builder
			.addCase(addEducationInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addEducationInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addEducationInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to add education";
				}
			})
			.addCase(updateEducationInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateEducationInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateEducationInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update education";
				}
			})
			.addCase(removeEducationFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeEducationFromDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(removeEducationFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove education";
				}
			});

		// Experience Extra Reducers
		builder
			.addCase(addExperienceInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addExperienceInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addExperienceInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to add experience";
				}
			})
			.addCase(updateExperienceInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateExperienceInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateExperienceInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update experience";
				}
			})
			.addCase(removeExperienceFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(
				removeExperienceFromDatabase.fulfilled,
				(state, action) => {
					const { portfolioId } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						portfolio.loading = false;
					}
				}
			)
			.addCase(removeExperienceFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove experience";
				}
			});

		// Hackathon Extra Reducers
		builder
			.addCase(addHackathonInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addHackathonInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addHackathonInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to add hackathon";
				}
			})
			.addCase(updateHackathonnInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateHackathonnInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateHackathonnInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update hackathon";
				}
			})
			.addCase(removeHackathonFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeHackathonFromDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(removeHackathonFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove hackathon";
				}
			});

		// Profile Extra Reducers
		builder
			.addCase(addProfileInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addProfileInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addProfileInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error = action.payload || "Failed to add profile";
				}
			})
			.addCase(updateProfileInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateProfileInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateProfileInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update profile";
				}
			})
			.addCase(removeProfileFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeProfileFromDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(removeProfileFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove profile";
				}
			});

		// Project Extra Reducers
		builder
			.addCase(addProjectInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addProjectInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addProjectInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error = action.payload || "Failed to add project";
				}
			})
			.addCase(updateProjectInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateProjectInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateProjectInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update project";
				}
			})
			.addCase(removeProjectFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeProjectFromDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(removeProjectFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove project";
				}
			});

		// Skill Extra Reducers
		builder
			.addCase(addSkillInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(addSkillInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(addSkillInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error = action.payload || "Failed to add skill";
				}
			})
			.addCase(updateSkillnInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateSkillnInDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(updateSkillnInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to update skill";
				}
			})
			.addCase(removeSkillFromDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(removeSkillFromDatabase.fulfilled, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
				}
			})
			.addCase(removeSkillFromDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload || "Failed to remove skill";
				}
			});
	},
});

export const {
	updateBasics,
	resetBasics,
	setCertifications,
	addCertification,
	updateCertification,
	removeCertification,
	toggleCertificationVisibility,
	setEducations,
	addEducation,
	updateEducation,
	removeEducation,
	toggleEducationVisibility,
	setExperience,
	addExperience,
	updateExperience,
	removeExperience,
	toggleExperienceVisibility,
	setHackathons,
	addHackathon,
	updateHackathon,
	removeHackathon,
	toggleHackathonVisibility,
	setProfiles,
	addProfile,
	updateProfile,
	removeProfile,
	toggleProfileVisibility,
	setProjects,
	addProject,
	updateProject,
	removeProject,
	toggleProjectVisibility,
	setSkills,
	addSkill,
	updateSkill,
	removeSkill,
	toggleSkillVisibility,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
