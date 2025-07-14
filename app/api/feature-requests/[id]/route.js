import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		const feature = await prisma.featureRequest.findUnique({
			where: { id },
			include: {
				author: { select: { id: true, email: true } },
				votes: true,
				comments: {
					include: { user: { select: { id: true, email: true } } },
					orderBy: { createdAt: "asc" },
				},
			},
		});

		if (!feature) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		return NextResponse.json(feature);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch feature request" },
			{ status: 500 }
		);
	}
}

export async function PATCH(request, { params }) {
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
		const { status } = body;

		if (!status) {
			return NextResponse.json(
				{ error: "Status required" },
				{ status: 400 }
			);
		}

		const feature = await prisma.featureRequest.update({
			where: { id },
			data: { status },
		});

		return NextResponse.json(feature);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update feature request" },
			{ status: 500 }
		);
	}
}
