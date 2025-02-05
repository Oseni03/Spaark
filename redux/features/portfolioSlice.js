import { createSlice } from "@reduxjs/toolkit";
import { portfolioSchema, defaultPortfolio } from "@/schema/sections";
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
	addProfileInDatabase,
	updateProfileInDatabase,
	removeProfileFromDatabase,
} from "../thunks/profile";
import { logger } from "@/lib/utils";
import { transformPortfolio } from "@/lib/utils";

// Initial State
const initialState = {
	items: [],
	loading: false, // Only global loading state
	error: null,
};

const portfolioSlice = createSlice({
	name: "portfolios",
	initialState,
	reducers: {
		setPortfolios(state, action) {
			state.loading = false;
			const portfolios = action.payload;
			logger.info("Setportfolios data: ", portfolios);
			const transformedData = portfolios.map((portfolio) =>
				transformPortfolio(portfolio)
			);
			state.items = transformedData;
		},
	},
	extraReducers: (builder) => {
		// Simplified loading handlers
		const setPending = (state) => {
			state.loading = true;
			state.error = null;
		};

		const setFulfilled = (state) => {
			state.loading = false;
		};

		const setRejected = (state, action) => {
			state.loading = false;
			state.error =
				action.payload?.error ||
				action.error?.message ||
				"Operation failed";
		};

		// Portfolio operations
		builder
			.addCase(addPortfolioInDatabase.pending, setPending)
			.addCase(addPortfolioInDatabase.fulfilled, (state, action) => {
				setFulfilled(state);
				const { data, error } = action.payload;
				if (error) {
					state.error = error;
					logger.error("Error adding portfolio:", error);
					return;
				}
				try {
					const transformedPortfolio = transformPortfolio(data);
					state.items.push(transformedPortfolio);
					logger.info(
						"Portfolio added successfully:",
						transformedPortfolio
					);
				} catch (error) {
					state.error = "Invalid portfolio data";
					logger.error("Error transforming portfolio data:", error);
				}
			})
			.addCase(addPortfolioInDatabase.rejected, setRejected)
			.addCase(updatePortfolioInDatabase.pending, setPending)
			.addCase(updatePortfolioInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.id
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update portfolio");
						return;
					}
					const result = portfolioSchema.safeParse(
						...defaultPortfolio,
						...data
					);
					if (result.success) {
						Object.assign(portfolio, result.data);
					} else {
						portfolio.error = "Invalid portfolio data";
						logger.error("Invalid portfolio data:", result.error);
					}
				}
			})
			.addCase(updatePortfolioInDatabase.rejected, setRejected)
			.addCase(removePortfolioFromDatabase.pending, setPending)
			.addCase(removePortfolioFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { id } = action.payload;
				state.items = state.items.filter(
					(portfolio) => portfolio.id !== id
				);
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

		// Profile Extra Reducers
		builder
			.addCase(addProfileInDatabase.pending, setPending)
			.addCase(addProfileInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to add profile");
						return;
					}
					logger.info("Adding profile to portfolio:", data);
					portfolio.profiles.items.push(data);
				}
			})
			.addCase(addProfileInDatabase.rejected, setRejected)
			.addCase(updateProfileInDatabase.pending, setPending)
			.addCase(updateProfileInDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				const { data, error } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.portfolioId
				);
				if (portfolio) {
					if (error) {
						portfolio.error = error;
						logger.error(error || "Failed to update profile");
						return;
					}
					const index = portfolio.profiles.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						portfolio.profiles.items[index] = data;
					}
				}
			})
			.addCase(updateProfileInDatabase.rejected, setRejected)
			.addCase(removeProfileFromDatabase.pending, setPending)
			.addCase(removeProfileFromDatabase.fulfilled, (state, action) => {
				setFulfilled(state, action);
				logger.info("Removing profile from database:", action.payload);
				const { portfolioId, profileId } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.profiles.items = portfolio.profiles.items.filter(
						(item) => item.id !== profileId
					);
				}
			})
			.addCase(removeProfileFromDatabase.rejected, setRejected);

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

export const { setPortfolios } = portfolioSlice.actions;

export default portfolioSlice.reducer;
