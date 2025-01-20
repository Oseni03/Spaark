import { createSlice } from "@reduxjs/toolkit";
import {
	certificationSchema,
	experienceSchema,
	educationSchema,
	hackathonSchema,
	projectSchema,
	skillSchema,
	portfolioSchema,
	defaultPortfolio,
} from "@/schema/sections";
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
import { basicsSchema } from "@/schema/sections/basics";

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
		setPortfolios(state, action) {
			const portfolios = action.payload;
			logger.info("Setportfolios data: ", portfolios);
			const transformedData = portfolios.map((portfolio) =>
				transformPortfolio(portfolio)
			);
			// const parsedPortfolios = portfolios
			// 	.map((portfolio) => {
			// 		const result = portfolioSchema.safeParse(portfolio);

			// 		if (result.success) {
			// 			return result.data;
			// 		} else {
			// 			logger.error("Invalid portfolio data:", result.error);
			// 			return null;
			// 		}
			// 	})
			// 	.filter(Boolean);
			// logger.info("parsed portfolios data: ", parsedPortfolios);
			state.items = transformedData;
		},
	},
	extraReducers: (builder) => {
		// Portfolio Extra Reducers
		builder
			.addCase(addPortfolioInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addPortfolioInDatabase.fulfilled, (state, action) => {
				state.loading = false;
				const { data, error } = action.payload;
				if (error) {
					logger.error(error || "Failed to add portfolio");
					return;
				}
				try {
					const transformedPortfolio = transformPortfolio(data);
					state.items.push(transformedPortfolio);
				} catch (error) {
					logger.error("Invalid portfolio data:", result.error);
				}
			})
			.addCase(addPortfolioInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload.error || "Failed to create portfolio";
			})
			.addCase(updatePortfolioInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updatePortfolioInDatabase.fulfilled, (state, action) => {
				state.loading = false;
				const { data } = action.payload;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === data.id
				);
				if (portfolio) {
					Object.assign(portfolio, data);
				}
			})
			.addCase(updatePortfolioInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload.error || "Failed to update portfolio";
			})
			.addCase(removePortfolioFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removePortfolioFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
				const { id } = action.payload;
				state.items = state.items.filter(
					(portfolio) => portfolio.id !== id
				);
			})
			.addCase(removePortfolioFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload.error || "Failed to delete portfolio";
			});

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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = basicsSchema.safeParse(data);
					if (result.success) {
						portfolio.basics = result.data;
						portfolio.status = "succeeded";
					} else {
						logger.error("Invalid basics data:", result.error);
					}
				}
			})
			.addCase(updateBasicsInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.status = "failed";
					portfolio.error = action.payload.error;
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
			.addCase(addCertificationInDatabase.fulfilled, (state, action) => {
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = certificationSchema.safeParse(data);
					if (result.success) {
						portfolio.certifications.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error(
							"Invalid certification data:",
							result.error
						);
					}
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
						action.payload.error || "Failed to add certification";
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
			.addCase(
				updateCertificationnInDatabase.fulfilled,
				(state, action) => {
					const { portfolioId, data } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						const index = portfolio.certifications.items.findIndex(
							(item) => item.id === data.id
						);
						if (index !== -1) {
							const result = certificationSchema.safeParse(data);
							if (result.success) {
								portfolio.certifications.items[index] =
									result.data;
								portfolio.loading = false;
							} else {
								logger.error(
									"Invalid certification data:",
									result.error
								);
							}
						}
					}
				}
			)
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
							action.payload.error ||
							"Failed to update certification";
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
			.addCase(
				removeCertificationFromDatabase.fulfilled,
				(state, action) => {
					const { portfolioId, certificationId } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						portfolio.certifications.items =
							portfolio.certifications.items.filter(
								(item) => item.id !== certificationId
							);
						portfolio.loading = false;
					}
				}
			)
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
							action.payload.error ||
							"Failed to remove certification";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = educationSchema.safeParse(data);
					if (result.success) {
						portfolio.educations.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid education data:", result.error);
					}
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
						action.payload.error || "Failed to add education";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.educations.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = educationSchema.safeParse(data);
						if (result.success) {
							portfolio.educations.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error(
								"Invalid education data:",
								result.error
							);
						}
					}
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
						action.payload.error || "Failed to update education";
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
				const { portfolioId, educationId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.educations.items =
						portfolio.educations.items.filter(
							(item) => item.id !== educationId
						);
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
						action.payload.error || "Failed to remove education";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = experienceSchema.safeParse(data);
					if (result.success) {
						portfolio.experiences.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid experience data:", result.error);
					}
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
						action.payload.error || "Failed to add experience";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.experiences.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = experienceSchema.safeParse(data);
						if (result.success) {
							portfolio.experiences.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error(
								"Invalid experience data:",
								result.error
							);
						}
					}
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
						action.payload.error || "Failed to update experience";
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
					const { portfolioId, experienceId } = action.meta.arg;
					const portfolio = state.items.find(
						(portfolio) => portfolio.id === portfolioId
					);
					if (portfolio) {
						portfolio.experiences.items =
							portfolio.experiences.items.filter(
								(item) => item.id !== experienceId
							);
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
						action.payload.error || "Failed to remove experience";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = hackathonSchema.safeParse(data);
					if (result.success) {
						portfolio.hackathons.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid hackathon data:", result.error);
					}
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
						action.payload.error || "Failed to add hackathon";
				}
			})
			.addCase(updateHackathonInDatabase.pending, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = true;
					portfolio.error = null;
				}
			})
			.addCase(updateHackathonInDatabase.fulfilled, (state, action) => {
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.hackathons.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = hackathonSchema.safeParse(data);
						if (result.success) {
							portfolio.hackathons.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error(
								"Invalid hackathon data:",
								result.error
							);
						}
					}
				}
			})
			.addCase(updateHackathonInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload.error || "Failed to update hackathon";
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
				const { portfolioId, hackathonId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.hackathons.items =
						portfolio.hackathons.items.filter(
							(item) => item.id !== hackathonId
						);
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
						action.payload.error || "Failed to remove hackathon";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = profileSchema.safeParse(data);
					if (result.success) {
						portfolio.profiles.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid profile data:", result.error);
					}
				}
			})
			.addCase(addProfileInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload.error || "Failed to add profile";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.profiles.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = profileSchema.safeParse(data);
						if (result.success) {
							portfolio.profiles.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error("Invalid profile data:", result.error);
						}
					}
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
						action.payload.error || "Failed to update profile";
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
				const { portfolioId, profileId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.profiles.items = portfolio.profiles.items.filter(
						(item) => item.id !== profileId
					);
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
						action.payload.error || "Failed to remove profile";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = projectSchema.safeParse(data);
					if (result.success) {
						portfolio.projects.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid project data:", result.error);
					}
				}
			})
			.addCase(addProjectInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload.error || "Failed to add project";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.projects.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = projectSchema.safeParse(data);
						if (result.success) {
							portfolio.projects.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error("Invalid project data:", result.error);
						}
					}
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
						action.payload.error || "Failed to update project";
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
				const { portfolioId, projectId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.projects.items = portfolio.projects.items.filter(
						(item) => item.id !== projectId
					);
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
						action.payload.error || "Failed to remove project";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const result = skillSchema.safeParse(data);
					if (result.success) {
						portfolio.skills.items.push(result.data);
						portfolio.loading = false;
					} else {
						logger.error("Invalid skill data:", result.error);
					}
				}
			})
			.addCase(addSkillInDatabase.rejected, (state, action) => {
				const { portfolioId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.loading = false;
					portfolio.error =
						action.payload.error || "Failed to add skill";
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
				const { portfolioId, data } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					const index = portfolio.skills.items.findIndex(
						(item) => item.id === data.id
					);
					if (index !== -1) {
						const result = skillSchema.safeParse(data);
						if (result.success) {
							portfolio.skills.items[index] = result.data;
							portfolio.loading = false;
						} else {
							logger.error("Invalid skill data:", result.error);
						}
					}
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
						action.payload.error || "Failed to update skill";
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
				const { portfolioId, skillId } = action.meta.arg;
				const portfolio = state.items.find(
					(portfolio) => portfolio.id === portfolioId
				);
				if (portfolio) {
					portfolio.skills.items = portfolio.skills.items.filter(
						(item) => item.id !== skillId
					);
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
						action.payload.error || "Failed to remove skill";
				}
			});
	},
});

export const { setPortfolios } = portfolioSlice.actions;

export default portfolioSlice.reducer;
