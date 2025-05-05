import { createSlice } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";
import { transformPortfolio } from "@/lib/utils";
import { defaultBasics } from "@/schema/sections/basics";
import {
	addPortfolioInDatabase,
	updatePortfolioInDatabase,
	removePortfolioFromDatabase,
} from "../thunks/portfolio";

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
		// Profile
		addProfile: (state, action) => {
			const { portfolioId, ...profile } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.profiles.items.push(profile);
			}
		},
		updateProfile: (state, action) => {
			const { portfolioId, ...profile } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				const index = portfolio.profiles.items.findIndex(
					(c) => c.id === profile.id
				);
				if (index !== -1) {
					portfolio.profiles.items[index] = {
						...profile,
						portfolioId,
					};
				}
			}
		},
		removeProfile: (state, action) => {
			const { portfolioId, profileId } = action.payload;
			const portfolio = state.items.find(
				(item) => item.id === portfolioId
			);
			if (portfolio) {
				portfolio.profiles.items = portfolio.profiles.items.filter(
					(c) => c.id !== profileId
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
	},
});

export const {
	setPortfolios,
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
	// Profile
	addProfile,
	updateProfile,
	removeProfile,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
