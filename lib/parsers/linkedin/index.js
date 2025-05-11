import { createId } from "@paralleldrive/cuid2";
import {
	defaultCertification,
	defaultEducation,
	defaultExperience,
	defaultHackathon,
	defaultProject,
	defaultSkill,
	defaultSocial,
	defaultMain,
} from "@/schema/sections";
import { parseCSV } from "@/lib/csv";
import * as JSZip from "jszip";
import { linkedInSchema } from "./schema";
import { logger } from "@/lib/utils";

export * from "./schema";

const avoidTooShort = (name, len) => {
	if (!name || name.length < len) return "Unknown";
	return name;
};

export class LinkedInParser {
	schema;

	constructor() {
		this.schema = linkedInSchema;
	}

	async readFile(file) {
		const data = await JSZip.loadAsync(file);

		if (Object.keys(data.files).length === 0) {
			throw new Error(
				"ParserError: There were no files found inside the zip archive."
			);
		}

		return data;
	}

	async validate(data) {
		const result = {};

		for (const [name, file] of Object.entries(data.files)) {
			for (const key of Object.keys(linkedInSchema.shape)) {
				if (name.includes(key)) {
					const content = await file.async("text");
					result[key] = await parseCSV(content);
				}
			}
		}

		return linkedInSchema.parse(result);
	}

	convert(data) {
		logger.info(data);
		const result = defaultMain;

		// Profile
		if (data.Profile && data.Profile.length > 0) {
			const profile = data.Profile[0];
			logger.info("LinkedIn profile: ", profile);
			const twitterHandle = profile["Twitter Handles"];

			result.basics.name = `${profile["First Name"]} ${profile["Last Name"]}`;
			result.basics.location = profile["Geo Location"];
			result.basics.headline = profile.Headline;
			result.basics.summary = profile.Summary;
			result.basics.about = profile.Bio;
			if (twitterHandle) {
				result.socials.items.push({
					...defaultSocial,
					id: createId(),
					network: "x",
					username: twitterHandle,
				});
			}
		}

		// Email Addresses
		if (data["Email Addresses"] && data["Email Addresses"].length > 0) {
			const email = data["Email Addresses"][0];

			result.basics.email = email["Email Address"];
		}

		// Positions
		if (data.Positions && data.Positions.length > 0) {
			for (const position of data.Positions) {
				logger.info("LinkedIn data: ", position);

				result.experiences.items.push({
					...defaultExperience,
					id: createId(),
					company: position["Company Name"],
					position: position.Title,
					location: position.Location,
					summary: position.Description ?? "",
					date: `${position["Started On"]} - ${position["Finished On"] ?? "Present"}`,
				});
			}
		}

		// Education
		if (data.Education && data.Education.length > 0) {
			for (const education of data.Education) {
				logger.info("LinkedIn education: ", education);

				result.educations.items.push({
					...defaultEducation,
					id: createId(),
					institution: avoidTooShort(education["School Name"], 2),
					studyType: avoidTooShort(education["Degree Name"], 2),
					summary: avoidTooShort(education.Notes ?? "", 2),
					date: `${education["Start Date"]} - ${education["End Date"] ?? "Present"}`,
				});
			}
		}

		// Skills
		if (data.Skills && data.Skills.length > 0) {
			for (const skill of data.Skills) {
				logger.info("LinkedIn skill: ", skill);

				result.skills.items.push({
					...defaultSkill,
					id: createId(),
					name: skill.Name,
				});
			}
		}

		// Certifications
		if (data.Certifications && data.Certifications.length > 0) {
			for (const certification of data.Certifications) {
				logger.info("LinkedIn certification: ", certification);

				result.certifications.items.push({
					...defaultCertification,
					id: createId(),
					name: certification.Name,
					issuer: certification.Authority,
					url: certification.Url,
					date: `${certification["Started On"]} - ${certification["Finished On"] ?? "Present"}`,
				});
			}
		}

		// Projects
		if (data.Projects && data.Projects.length > 0) {
			for (const project of data.Projects) {
				logger.info("LinkedIn project: ", project);

				result.projects.items.push({
					...defaultProject,
					id: createId(),
					name: project.Title,
					description: project.Description,
					website: project.Url ?? "",
					date: `${project["Started On"]} - ${project["Finished On"] ?? "Present"}`,
				});
			}
		}

		return resumeDataSchema.parse(result);
	}
}
