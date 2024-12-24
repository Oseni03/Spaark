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
import cors from "cors";

// Configure CORS
const corsMiddleware = cors({
	origin: [
		`https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		new RegExp(`^https:\/\/.*\.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}$`), // Allows all subdomains
		process.env.NEXT_PUBLIC_ROOT_DOMAIN,
		"http://localhost:3000",
		new RegExp(`^http:\/\/.*\.localhost:3000$`), // Allows all localhost subdomains
	],
	methods: ["GET", "HEAD"],
	credentials: true,
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
}

// Handle GET requests to fetch user data
export async function GET(req) {
	try {
		// Create response object
		const response = new NextResponse();

		// Run CORS middleware
		await runMiddleware(req, response, corsMiddleware);

		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username");

		let userId;

		if (username) {
			const user = await getUserByUsername(username);

			if (!user.success) {
				return NextResponse.json(
					{ error: user.error || "User not found" },
					{
						status: 404,
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET, HEAD",
							"Access-Control-Allow-Credentials": "true",
						},
					}
				);
			}

			userId = user.data.id;
		} else {
			const { userId: authenticatedUserId } = await auth();

			if (!authenticatedUserId) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{
						status: 401,
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET, HEAD",
							"Access-Control-Allow-Credentials": "true",
						},
					}
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

		return NextResponse.json(responseData, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, HEAD",
				"Access-Control-Allow-Credentials": "true",
			},
		});
	} catch (error) {
		console.log("Error fetching user data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user data" },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, HEAD",
					"Access-Control-Allow-Credentials": "true",
				},
			}
		);
	}
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req) {
	return NextResponse.json(
		{},
		{
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, HEAD",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
				"Access-Control-Allow-Credentials": "true",
			},
		}
	);
}
