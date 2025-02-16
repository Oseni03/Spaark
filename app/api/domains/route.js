import {
	addDomainToVercel,
	removeDomainFromVercelProject,
	validDomainRegex,
} from "@/lib/domains";
import { logger } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		// Get auth token and validate
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { domain } = await req.json();

		if (!domain) {
			return new NextResponse("Missing domain", { status: 400 });
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
		const vercelResponse = await addDomainToVercel(domain);
		if (vercelResponse.error) {
			return NextResponse.json(
				{ success: false, error: vercelResponse.error.message },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("[DOMAINS_POST]", error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || "Internal error",
				details: process.env.NODE_ENV === 'development' ? error.stack : undefined
			},
			{ status: error.status || 500 }
		);
	}
}

export async function DELETE(req) {
	try {
		// Get auth token and validate
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
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
