import { NextResponse } from "next/server";
import { getUserBasics } from "@/services/user";
import { getUserCertifications } from "@/services/certification";
import { getUserEducations } from "@/services/education";
import { getUserExperiences } from "@/services/experience";
import { getUserProfiles } from "@/services/profile";
import { getUserSkills } from "@/services/skill";
import { auth } from "@clerk/nextjs/server";

// Handle GET requests to fetch user data
export async function GET(req) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Fetch data concurrently
		const [
			basics,
			profiles,
			experiences,
			educations,
			certifications,
			skills,
		] = await Promise.all([
			getUserBasics(userId),
			getUserProfiles(userId),
			getUserExperiences(userId),
			getUserEducations(userId),
			getUserCertifications(userId),
			getUserSkills(userId),
		]);

		// Structure the response
		const responseData = {
			basics,
			profiles,
			experiences,
			educations,
			certifications,
			skills,
		};

		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		console.log("Error fetching user data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user data" },
			{ status: 500 }
		);
	}
}
