import {
	addDomainToVercel,
	removeDomainFromVercelProject,
} from "@/lib/domains";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { validDomainRegex } from "@/lib/domains";

export async function POST(req) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { domain, portfolioId } = await req.json();

		if (!domain || !portfolioId) {
			return new NextResponse("Missing required fields", { status: 400 });
		}

		if (domain.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
			return new NextResponse(
				`Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`,
				{ status: 400 }
			);
		}

		if (!validDomainRegex.test(domain)) {
			return new NextResponse("Invalid domain format", { status: 400 });
		}

		// Add domain to Vercel
		await addDomainToVercel(domain);

		// Update portfolio with custom domain
		const response = await prisma.portfolio.update({
			where: { id: portfolioId },
			data: { customDomain: domain },
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("[DOMAINS_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(req) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const domain = searchParams.get("domain");
		const portfolioId = searchParams.get("portfolioId");

		if (!domain || !portfolioId) {
			return new NextResponse("Missing required fields", { status: 400 });
		}

		// Remove domain from Vercel
		await removeDomainFromVercelProject(domain);

		// Remove custom domain from portfolio
		const response = await prisma.portfolio.update({
			where: { id: portfolioId },
			data: { customDomain: null },
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("[DOMAINS_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
