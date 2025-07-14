import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function POST(request, { params }) {
	try {
		const userId = await getUserIdFromSession();

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id } = await params;

		// Prevent duplicate votes
		const existing = await prisma.featureVote.findUnique({
			where: {
				featureRequestId_userId: {
					featureRequestId: id,
					userId,
				},
			},
		});

		if (existing) {
			return NextResponse.json(
				{ error: "Already voted" },
				{ status: 400 }
			);
		}

		const vote = await prisma.featureVote.create({
			data: {
				featureRequestId: id,
				userId,
			},
		});

		return NextResponse.json(vote, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
	}
}
