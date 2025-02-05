import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { slug, excludeId } = await request.json();

		const existingBlog = await prisma.blog.findFirst({
			where: {
				slug: slug,
				NOT: excludeId ? { id: excludeId } : undefined,
			},
		});

		return NextResponse.json({
			isUnique: !existingBlog,
			message: existingBlog ? "Slug already exists" : "Slug is available",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to validate slug" },
			{ status: 500 }
		);
	}
}
