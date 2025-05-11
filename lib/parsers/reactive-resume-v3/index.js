import { createId } from "@paralleldrive/cuid2";
import { isUrl } from "@/lib/utils";
import { reactiveResumeV3Schema } from "./schema";
import {
	defaultCertification,
	defaultEducation,
	defaultExperience,
	defaultMain,
	defaultProject,
	defaultSkill,
	defaultSocial,
} from "@/schema/sections";
import { logger } from "@/lib/utils";

export * from "./schema";

export class ReactiveResumeV3Parser {
	schema;

	constructor() {
		this.schema = reactiveResumeV3Schema;
	}

	readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				try {
					const result = JSON.parse(reader.result);
					resolve(result);
				} catch {
					reject(new Error("Failed to parse JSON"));
				}
			};

			reader.onerror = () => {
				reject(new Error("Failed to read the file"));
			};

			reader.readAsText(file);
		});
	}

	validate(data) {
		return this.schema.parse(data);
	}

	convert(data) {
		logger.info("Reactive resume data: ", data);
		const result = JSON.parse(JSON.stringify(defaultMain));
		// const result = defaultMain;

		logger.info("Result: ", result);

		// Basics
		result.basics.name = data.basics.name ?? "";
		result.basics.email = data.basics.email;
		result.basics.phone = data.basics.phone ?? "";
		result.basics.headline = data.basics.headline ?? "";
		result.basics.location = data.basics.location.address ?? "";
		result.basics.summary =
			(typeof data.basics.summary === "string"
				? data.basics.summary
				: data.basics.summary?.body) ?? "";
		result.basics.picture = isUrl(data.basics.photo.url)
			? data.basics.photo.url
			: "";

		// Socials
		if (data.basics.profiles && data.basics.profiles.length > 0) {
			for (const profile of data.basics.profiles) {
				result.socials.items.push({
					...defaultSocial,
					id: createId(),
					network: profile.network ?? "",
					username: profile.username ?? "",
				});
			}
		}

		// Work
		if (data.sections.work?.items && data.sections.work.items.length > 0) {
			for (const work of data.sections.work.items) {
				if (!work) continue;

				result.experiences.items.push({
					...defaultExperience,
					id: createId(),
					company: work.name ?? "",
					position: work.position ?? "",
					summary: work.summary ?? "",
					date: `${work.date?.start} - ${work.date?.end}`,
					url: isUrl(work.url) ? work.url : "",
				});
			}
		}

		// Skills
		if (
			data.sections.skills?.items &&
			data.sections.skills.items.length > 0
		) {
			for (const skill of data.sections.skills.items) {
				if (!skill) continue;

				result.skills.items.push({
					...defaultSkill,
					id: createId(),
					name: skill.name ?? "",
					level: Math.floor(skill.levelNum / 2),
					description: skill.level ?? "",
				});
			}
		}

		// Projects
		if (
			data.sections.projects?.items &&
			data.sections.projects.items.length > 0
		) {
			for (const project of data.sections.projects.items) {
				if (!project) continue;

				result.projects.items.push({
					...defaultProject,
					id: createId(),
					name: project.name ?? "",
					summary: project.summary ?? "",
					description:
						project.summary && project.description
							? `${project.summary}\n ${project.description}`
							: (project.summary ?? project.description ?? ""),
					date: `${project.date?.start} - ${project.date?.end}`,
					technologies: Array.isArray(project.keywords)
						? project.keywords.filter(Boolean)
						: [],
					url: isUrl(project.url) ? project.url : "",
				});
			}
		}

		// Education
		if (
			data.sections.education?.items &&
			data.sections.education.items.length > 0
		) {
			for (const education of data.sections.education.items) {
				if (!education) continue;

				result.educations.items.push({
					...defaultEducation,
					id: createId(),
					institution: education.institution ?? "",
					studyType: education.degree ?? "",
					location: education.area ?? "",
					summary: education.summary ?? "",
					date: `${education.date?.start} - ${education.date?.end}`,
					url: isUrl(education.url) ? education.url : "",
				});
			}
		}

		// Certifications
		if (
			data.sections.certifications?.items &&
			data.sections.certifications.items.length > 0
		) {
			for (const certification of data.sections.certifications.items) {
				if (!certification) continue;

				result.certifications.items.push({
					...defaultCertification,
					id: createId(),
					name: certification.name ?? "",
					issuer: certification.issuer ?? "",
					summary: certification.summary ?? "",
					date: certification.date ?? "",
					url: isUrl(certification.url) ? certification.url : "",
				});
			}
		}

		return result;
	}
}
