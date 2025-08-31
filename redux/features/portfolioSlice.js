import { createSlice } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";
import { transformPortfolio } from "@/lib/utils";
import { defaultBasics } from "@/schema/sections/basics";
import {
	addPortfolioInDatabase,
	updatePortfolioInDatabase,
	removePortfolioFromDatabase,
} from "../thunks/portfolio";
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
	updateHackathonInDatabase,
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
import {
	addSocialInDatabase,
	updateSocialInDatabase,
	removeSocialFromDatabase,
} from "../thunks/social";

// Initial State
const initialState = {
	items: [],
	status: "idle",
	error: null,
	loading: false,
};

const portfolioSlice = createSlice({
	name: "portfolios",
	initialState,
	reducers: {
		setPortfolios(state, action) {
			state.status = "succeeded";
			state.loading = false;
			state.error = null;
			const portfolios = action.payload;
			logger.info("Setportfolios data: ", portfolios);
			const transformedData = portfolios.map((portfolio) =>
				transformPortfolio(portfolio)
			);
			state.items = transformedData;
		},
		updatePortfolio: (state, action) => {
			const { id, data } = action.payload;
			const portfolio = state.items.find((item) => item.id === id);
			if (portfolio) {
				const updatedData = { ...portfolio, ...data };
				Object.assign(portfolio, updatedData);
			}
		},
		// Basics
		addBasics: (state, action) => {
			const { portfolioId, ...basics } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.basics = basics;
			}
		},
		updateBasics: (state, action) => {
			const { portfolioId, ...basics } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.basics = { ...portfolio.basics, ...basics };
			}
		},
		removeBasics: (state, action) => {
			const { portfolioId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.basics = defaultBasics;
			}
		},
		// Experience
		addExperience: (state, action) => {
			const { portfolioId, ...experience } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.experiences.items = [
					...(portfolio.experiences.items || []),
					experience,
				];
			}
		},
		updateExperience: (state, action) => {
			const { portfolioId, ...experience } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.experiences.items.findIndex(
					(exp) => exp.id === experience.id
				);
				if (index !== -1) {
					portfolio.experiences.items[index] = {
						...portfolio.experiences.items[index],
						...experience,
					};
				}
			}
		},
		removeExperience: (state, action) => {
			const { portfolioId, experienceId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.experiences.items =
					portfolio.experiences.items.filter(
						(exp) => exp.id !== experienceId
					);
			}
		},
		// Education
		addEducation: (state, action) => {
			const { portfolioId, ...education } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.educations.items = [
					...(portfolio.educations.items || []),
					education,
				];
			}
		},
		updateEducation: (state, action) => {
			const { portfolioId, ...education } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.educations.items.findIndex(
					(edu) => edu.id === education.id
				);
				if (index !== -1) {
					portfolio.educations.items[index] = {
						...portfolio.educations.items[index],
						...education,
					};
				}
			}
		},
		removeEducation: (state, action) => {
			const { portfolioId, educationId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.educations.items = portfolio.educations.items.filter(
					(edu) => edu.id !== educationId
				);
			}
		},
		// Skill
		addSkill: (state, action) => {
			const { portfolioId, ...skill } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.skills.items = [
					...(portfolio.skills.items || []),
					skill,
				];
			}
		},
		updateSkill: (state, action) => {
			const { portfolioId, skillId, ...skill } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.skills.items.findIndex(
					(s) => s.id === skill.id
				);
				if (index !== -1) {
					portfolio.skills.items[index] = {
						...portfolio.skills.items[index],
						...skill,
					};
				}
			}
		},
		removeSkill: (state, action) => {
			const { portfolioId, skillId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.skills.items = portfolio.skills.items.filter(
					(s) => s.id !== skillId
				);
			}
		},
		// Project
		addProject: (state, action) => {
			const { portfolioId, ...project } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.projects.items = [
					...(portfolio.projects.items || []),
					project,
				];
			}
		},
		updateProject: (state, action) => {
			const { portfolioId, ...project } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.projects.items.findIndex(
					(p) => p.id === project.id
				);
				if (index !== -1) {
					portfolio.projects.items[index] = {
						...portfolio.projects.items[index],
						...project,
					};
				}
			}
		},
		removeProject: (state, action) => {
			const { portfolioId, projectId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.projects.items = portfolio.projects.items.filter(
					(p) => p.id !== projectId
				);
			}
		},
		// Hackathon
		addHackathon: (state, action) => {
			const { portfolioId, ...hackathon } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.hackathons.items = [
					...(portfolio.hackathons.items || []),
					hackathon,
				];
			}
		},
		updateHackathon: (state, action) => {
			const { portfolioId, ...hackathon } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.hackathons.items.findIndex(
					(h) => h.id === hackathon.id
				);
				if (index !== -1) {
					portfolio.hackathons.items[index] = {
						...portfolio.hackathons.items[index],
						...hackathon,
					};
				}
			}
		},
		removeHackathon: (state, action) => {
			const { portfolioId, hackathonId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.hackathons.items = portfolio.hackathons.items.filter(
					(h) => h.id !== hackathonId
				);
			}
		},
		// Certification
		addCertification: (state, action) => {
			const { portfolioId, ...certification } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.certifications.items.push(certification);
			}
		},
		updateCertification: (state, action) => {
			const { portfolioId, ...certification } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.certifications.items.findIndex(
					(c) => c.id === certification.id
				);
				if (index !== -1) {
					portfolio.certifications.items[index] = {
						...certification,
						portfolioId,
					};
				}
			}
		},
		removeCertification: (state, action) => {
			const { portfolioId, certificationId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.certifications.items =
					portfolio.certifications.items.filter(
						(c) => c.id !== certificationId
					);
			}
		},
		// Social
		addSocial: (state, action) => {
			const { portfolioId, ...social } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.socials.items.push(social);
			}
		},
		updateSocial: (state, action) => {
			const { portfolioId, ...social } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.socials.items.findIndex(
					(c) => c.id === social.id
				);
				if (index !== -1) {
					portfolio.socials.items[index] = {
						...social,
						portfolioId,
					};
				}
			}
		},
		removeSocial: (state, action) => {
			const { portfolioId, socialId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.socials.items = portfolio.socials.items.filter(
					(c) => c.id !== socialId
				);
			}
		},
	},
	extraReducers: (builder) => {
		// Loading state handlers
		const setPending = (state) => {
			state.status = "loading";
			state.loading = true;
			state.error = null;
		};

		const setFulfilled = (state) => {
			state.status = "succeeded";
			state.loading = false;
			state.error = null;
		};

		const setRejected = (state, action) => {
			state.status = "failed";
			state.loading = false;
			state.error =
				action.payload?.error ||
				action.error?.message ||
				"Operation failed";
			logger.error("Operation failed:", state.error);
		};

		// Portfolio operations
		builder
			.addCase(addPortfolioInDatabase.pending, setPending)
			.addCase(addPortfolioInDatabase.fulfilled, (state, action) => {
				const { data, error } = action.payload;
				if (error) {
					setRejected(state, { payload: { error } });
					logger.error("Error adding portfolio:", error);
					return;
				}
				try {
					const transformedPortfolio = transformPortfolio(data);
					state.items.push(transformedPortfolio);
					setFulfilled(state);
					logger.info(
						"Portfolio added successfully:",
						transformedPortfolio
					);
				} catch (error) {
					setRejected(state, {
						payload: { error: "Invalid portfolio data" },
					});
					logger.error("Error transforming portfolio data:", error);
				}
			})
			.addCase(addPortfolioInDatabase.rejected, setRejected)
			.addCase(updatePortfolioInDatabase.pending, setPending)
			.addCase(updatePortfolioInDatabase.fulfilled, (state, action) => {
				const { data, error } = action.payload;
				if (error) {
					setRejected(state, { payload: { error } });
					logger.error("Error updating portfolio:", error);
					return;
				}
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.id
				);
				if (portfolio) {
					// Ensure createdAt is preserved if not provided in update
					const updatedData = {
						...data,
						createdAt: data.createdAt || portfolio.createdAt,
					};
					Object.assign(portfolio, updatedData);
					setFulfilled(state);
				} else {
					setRejected(state, {
						payload: { error: "Portfolio not found" },
					});
				}
			})
			.addCase(updatePortfolioInDatabase.rejected, setRejected)
			.addCase(removePortfolioFromDatabase.pending, setPending)
			.addCase(removePortfolioFromDatabase.fulfilled, (state, action) => {
				const { id } = action.payload;
				state.items = state.items.filter(
					(portfolio) => portfolio.id !== id
				);
				setFulfilled(state);
			})
			.addCase(removePortfolioFromDatabase.rejected, setRejected);

		// Basics Extra Reducers
		builder
			.addCase(updateBasicsInDatabase.pending, setPending)
			.addCase(updateBasicsInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update basics");
						return;
					}
					portfolio.basics = data;
					portfolio.status = "succeeded";
				}
			})
			.addCase(updateBasicsInDatabase.rejected, setRejected);

		// Certification Extra Reducers
		builder
			.addCase(addCertificationInDatabase.pending, setPending)
			.addCase(addCertificationInDatabase.fulfilled, (state, action) => {
				setFulfilled(state);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (!portfolio) return;

				if (error) {
					state.error = error;
					logger.error(error || "Failed to add certification");
					return;
				}

				// Simply push the data without individual schema validation
				portfolio.certifications.items.push(data);
			})
			.addCase(addCertificationInDatabase.rejected, setRejected)
			.addCase(updateCertificationnInDatabase.pending, setPending)
			.addCase(
				updateCertificationnInDatabase.fulfilled,
				(state, action) => {
					setFulfilled(state, action);
					const { data, error } = action.payload;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === data.portfolioId
					);
					if (!portfolio) return;

					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update certification");
						return;
					}

					const index = portfolio.certifications.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.certifications.items[index] = data;
					}
				}
			)
			.addCase(updateCertificationnInDatabase.rejected, setRejected)
			.addCase(removeCertificationFromDatabase.pending, setPending)
			.addCase(
				removeCertificationFromDatabase.fulfilled,
				(state, action) => {
					setFulfilled(state, action);
					const { portfolioId, certificationId } = action.payload;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (!portfolio) return;

					portfolio.certifications.items =
						portfolio.certifications.items.filter(
							(item) => item.id !== certificationId
						);
				}
			)
			.addCase(removeCertificationFromDatabase.rejected, setRejected);

		// Education Extra Reducers
		builder
			.addCase(addEducationInDatabase.pending, setPending)
			.addCase(addEducationInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add education");
						return;
					}
					portfolio.educations.items.push(data);
				}
			})
			.addCase(addEducationInDatabase.rejected, setRejected)
			.addCase(updateEducationInDatabase.pending, setPending)
			.addCase(updateEducationInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update education");
						return;
					}

					const index = portfolio.educations.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.educations.items[index] = data;
					}
				}
			})
			.addCase(updateEducationInDatabase.rejected, setRejected)
			.addCase(removeEducationFromDatabase.pending, setPending)
			.addCase(removeEducationFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { portfolioId, educationId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.educations.items =
						portfolio.educations.items.filter(
							(item) => item.id !== educationId
						);
				}
			})
			.addCase(removeEducationFromDatabase.rejected, setRejected);

		// Experience Extra Reducers
		builder
			.addCase(addExperienceInDatabase.pending, setPending)
			.addCase(addExperienceInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				logger.info("Adding experience to database:", data);
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add Experience");
						return;
					}
					portfolio.experiences.items.push(data);
				}
			})
			.addCase(addExperienceInDatabase.rejected, setRejected)
			.addCase(updateExperienceInDatabase.pending, setPending)
			.addCase(updateExperienceInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update experience");
						return;
					}
					const index = portfolio.experiences.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.experiences.items[index] = data;
					}
				}
			})
			.addCase(updateExperienceInDatabase.rejected, setRejected)
			.addCase(removeExperienceFromDatabase.pending, setPending)
			.addCase(
				removeExperienceFromDatabase.fulfilled,
				(state, action) => {
					setFulfilled(state, action);
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
				}
			)
			.addCase(removeExperienceFromDatabase.rejected, setRejected);

		// Hackathon Extra Reducers
		builder
			.addCase(addHackathonInDatabase.pending, setPending)
			.addCase(addHackathonInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add hackathon");
						return;
					}
					portfolio.hackathons.items.push(data);
				}
			})
			.addCase(addHackathonInDatabase.rejected, setRejected)
			.addCase(updateHackathonInDatabase.pending, setPending)
			.addCase(updateHackathonInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update hackathon");
						return;
					}
					const index = portfolio.hackathons.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.hackathons.items[index] = data;
					}
				}
			})
			.addCase(updateHackathonInDatabase.rejected, setRejected)
			.addCase(removeHackathonFromDatabase.pending, setPending)
			.addCase(removeHackathonFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { portfolioId, hackathonId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.hackathons.items =
						portfolio.hackathons.items.filter(
							(item) => item.id !== hackathonId
						);
				}
			})
			.addCase(removeHackathonFromDatabase.rejected, setRejected);

		// Social Extra Reducers
		builder
			.addCase(addSocialInDatabase.pending, setPending)
			.addCase(addSocialInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add social");
						return;
					}
					logger.info("Adding social to portfolio:", data);
					portfolio.socials.items.push(data);
				}
			})
			.addCase(addSocialInDatabase.rejected, setRejected)
			.addCase(updateSocialInDatabase.pending, setPending)
			.addCase(updateSocialInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update social");
						return;
					}
					const index = portfolio.socials.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.socials.items[index] = data;
					}
				}
			})
			.addCase(updateSocialInDatabase.rejected, setRejected)
			.addCase(removeSocialFromDatabase.pending, setPending)
			.addCase(removeSocialFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				logger.info("Removing social from database:", action.payload);
				const { portfolioId, socialId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.socials.items = portfolio.socials.items.filter(
						(item) => item.id !== socialId
					);
				}
			})
			.addCase(removeSocialFromDatabase.rejected, setRejected);

		// Project Extra Reducers
		builder
			.addCase(addProjectInDatabase.pending, setPending)
			.addCase(addProjectInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add project");
						return;
					}
					portfolio.projects.items.push(data);
				}
			})
			.addCase(addProjectInDatabase.rejected, setRejected)
			.addCase(updateProjectInDatabase.pending, setPending)
			.addCase(updateProjectInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update project");
						return;
					}
					const index = portfolio.projects.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.projects.items[index] = data;
					}
				}
			})
			.addCase(updateProjectInDatabase.rejected, setRejected)
			.addCase(removeProjectFromDatabase.pending, setPending)
			.addCase(removeProjectFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { portfolioId, projectId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.projects.items = portfolio.projects.items.filter(
						(item) => item.id !== projectId
					);
				}
			})
			.addCase(removeProjectFromDatabase.rejected, setRejected);

		// Skill Extra Reducers
		builder
			.addCase(addSkillInDatabase.pending, setPending)
			.addCase(addSkillInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add skill");
						return;
					}
					portfolio.skills.items.push(data);
				}
			})
			.addCase(addSkillInDatabase.rejected, setRejected)
			.addCase(updateSkillnInDatabase.pending, setPending)
			.addCase(updateSkillnInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update skill");
						return;
					}
					const index = portfolio.skills.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.skills.items[index] = data;
					}
				}
			})
			.addCase(updateSkillnInDatabase.rejected, setRejected)
			.addCase(removeSkillFromDatabase.pending, setPending)
			.addCase(removeSkillFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { portfolioId, skillId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.skills.items = portfolio.skills.items.filter(
						(item) => item.id !== skillId
					);
				}
			})
			.addCase(removeSkillFromDatabase.rejected, setRejected);
	},
});

export const {
	setPortfolios,
	updatePortfolio,
	// Basics
	addBasics,
	updateBasics,
	removeBasics,
	// Experience
	addExperience,
	updateExperience,
	removeExperience,
	// Education
	addEducation,
	updateEducation,
	removeEducation,
	// Skill
	addSkill,
	updateSkill,
	removeSkill,
	// Project
	addProject,
	updateProject,
	removeProject,
	// Hackathon
	addHackathon,
	updateHackathon,
	removeHackathon,
	// Certification
	addCertification,
	updateCertification,
	removeCertification,
	// Social
	addSocial,
	updateSocial,
	removeSocial,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
