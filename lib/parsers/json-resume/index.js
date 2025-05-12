import { createId } from "@paralleldrive/cuid2";
import { defaultBasics } from "@/schema/sections/basics";
import {
	defaultCertification,
	defaultProject,
	defaultEducation,
	defaultExperience,
	defaultHackathon,
	defaultMain,
	defaultSkill,
	defaultSocial,
} from "@/schema/sections";
import { jsonResumeSchema } from "./schema";
import { generateRandomName } from "@/lib/utils";
import slugify from "@sindresorhus/slugify";

export * from "./schema";

export class JsonResumeParser {
	schema;

	constructor() {
		this.schema = jsonResumeSchema;
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
		const result = JSON.parse(JSON.stringify(defaultMain));
		// const result = defaultMain;

		const name = generateRandomName();
		result.name = name;
		result.slug = slugify(name);

		// Basics
		result.basics.name = data.basics?.name ?? "";
		result.basics.headline = data.basics?.label ?? "";
		result.basics.picture = data.basics?.image ?? "";
		result.basics.email = data.basics?.email ?? "";
		result.basics.phone = data.basics?.phone ?? "";
		result.basics.location = data.basics?.location?.address ?? "";
		result.basics.summary = data.basics?.summary ?? "";
		result.basics.about = data.basics?.about ?? "";
		result.basics.years = data.basics?.years ?? null;

		// Profiles
		if (data.basics?.profiles) {
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
		if (data.work) {
			for (const work of data.work) {
				result.experiences.items.push({
					...defaultExperience,
					id: createId(),
					company: work.name ?? "",
					position: work.position ?? "",
					summary: work.summary ?? "",
					date: `${work.startDate} - ${work.endDate}`,
					url: work.url ?? "",
				});
			}
		}

		// Project
		if (data.project) {
			for (const project of data.project) {
				result.projects.items.push({
					...defaultProject,
					id: createId(),
					name: project.name ?? "",
					description: project.description ?? "",
					date: `${project.startDate} - ${project.endDate}`,
					technologies: project.technologies ?? [],
					website: project.url ?? "",
					source: project.source ?? "",
					image: project.image ?? "",
					video: project.video ?? "",
					type: project.type ?? "",
				});
			}
		}

		// Education
		if (data.education) {
			for (const education of data.education) {
				result.educations.items.push({
					...defaultEducation,
					id: createId(),
					institution: education.institution ?? "",
					studyType: education.studyType ?? "",
					summary: education.summary ?? "",
					logo: education.logo ?? "",
					date: `${education.startDate} - ${education.endDate}`,
					url: education.url ?? "",
					location: education.location ?? "",
				});
			}
		}

		// Certificates
		if (data.certificates) {
			for (const certificate of data.certificates) {
				result.certifications.items.push({
					...defaultCertification,
					id: createId(),
					name: certificate.name ?? "",
					date: certificate.date ?? "",
					issuer: certificate.issuer ?? "",
					summary: certificate.summary ?? "",
					url: certificate.url ?? "",
				});
			}
		}

		// Skills
		if (data.skills) {
			for (const skill of data.skills) {
				result.skills.items.push({
					...defaultSkill,
					id: createId(),
					name: skill.name ?? "",
					level: skill.level ?? "",
					description: skill.description ?? "",
				});
			}
		}

		// Hackathon
		if (data.hackathons) {
			for (const hackathon of data.hackathons) {
				result.hackathons.items.push({
					...defaultHackathon,
					id: createId(),
					name: hackathon.name ?? "",
					location: hackathon.location ?? "",
					description: hackathon.description ?? "",
					date: hackathon.date ?? "",
					logo: hackathon.picture ?? "",
					technologies: hackathon.technologies ?? [],
				});
			}
		}

		return result;
	}
}
