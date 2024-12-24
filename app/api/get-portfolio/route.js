import { NextResponse } from "next/server";
import { getUser, getUserBasics, getUserByUsername } from "@/services/user";
import { getUserCertifications } from "@/services/certification";
import { getUserEducations } from "@/services/education";
import { getUserExperiences } from "@/services/experience";
import { getUserProfiles } from "@/services/profile";
import { getUserSkills } from "@/services/skill";
import { auth } from "@clerk/nextjs/server";
import { getUserProjects } from "@/services/project";
import { getUserHackathons } from "@/services/hackathon";

// Handle GET requests to fetch user data
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username");
		console.log("Subdomain/username: ", username);

		let userId;

		if (username) {
			const user = await getUserByUsername(username);
			console.log("User response: ", user);

			if (!user.success) {
				return NextResponse.json(
					{ error: user.error || "User not found" },
					{ status: 404 }
				);
			}

			userId = user.data.id;
		} else {
			const { userId: authenticatedUserId } = await auth();

			if (!authenticatedUserId) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}

			userId = authenticatedUserId;
		}

		const results = await Promise.allSettled([
			getUserBasics(userId),
			getUserProfiles(userId),
			getUserExperiences(userId),
			getUserEducations(userId),
			getUserCertifications(userId),
			getUserSkills(userId),
			getUserProjects(userId),
			getUserHackathons(userId),
			getUser(userId),
		]);

		const [
			basics,
			profiles,
			experiences,
			educations,
			certifications,
			skills,
			projects,
			hackathons,
			user,
		] = results.map((result) =>
			result.status === "fulfilled" ? result.value : null
		);

		const responseData = {
			basics,
			profiles,
			experiences,
			educations,
			certifications,
			skills,
			projects,
			hackathons,
			user,
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
