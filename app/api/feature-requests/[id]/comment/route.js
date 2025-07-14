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
		const body = await request.json();
		const { content } = body;

		if (!content) {
			return NextResponse.json(
				{ error: "Content required" },
				{ status: 400 }
			);
		}

		const comment = await prisma.featureRequestComment.create({
			data: {
				featureRequestId: id,
				userId,
				content,
			},
		});

		return NextResponse.json(comment, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to add comment" },
			{ status: 500 }
		);
	}
}
