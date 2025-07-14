import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const status = searchParams.get("status");
	const category = searchParams.get("category");
	const search = searchParams.get("search");

	const where = {};
	if (status) where.status = status;
	if (category) where.category = category;
	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
		];
	}

	try {
		const features = await prisma.featureRequest.findMany({
			where,
			include: {
				author: { select: { id: true, email: true } },
				votes: true,
				comments: true,
			},
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(features);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch features" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const userId = await getUserIdFromSession();

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const {
			title,
			description,
			useCase,
			painPoint,
			outcome,
			category,
			tags,
		} = body;

		if (!title || !description) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const feature = await prisma.featureRequest.create({
			data: {
				title,
				description,
				useCase,
				painPoint,
				outcome,
				category,
				tags: tags || [],
				authorId: userId,
			},
		});

		return NextResponse.json(feature, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create feature request" },
			{ status: 500 }
		);
	}
}
