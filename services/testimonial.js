"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { testimonialSchema } from "@/schema/sections";

const testimonialSelect = {
	id: true,
	visible: true,
	name: true,
	role: true,
	company: true,
	message: true,
	avatar: true,
	rating: true,
	portfolioId: true,
};

export async function getTestimonials(portfolioId) {
	return withErrorHandling(async () => {
		const testimonials = await prisma.testimonial.findMany({
			where: { portfolioId },
			select: testimonialSelect,
		});
		return testimonials.map((item) => testimonialSchema.parse(item));
	});
}

export async function createTestimonial({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const testimonial = await prisma.testimonial.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select: testimonialSelect,
		});

		revalidatePath("/builder");
		return testimonialSchema.parse(testimonial);
	});
}

export async function editTestimonial(testimonialId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const testimonial = await prisma.testimonial.update({
			where: { id: testimonialId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: testimonialSelect,
		});

		revalidatePath("/builder");
		return testimonialSchema.parse(testimonial);
	});
}

export async function deleteTestimonial(testimonialId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		await prisma.testimonial.delete({
			where: { id: testimonialId, portfolioId },
		});

		revalidatePath("/builder");
		return { testimonialId, portfolioId };
	});
}
