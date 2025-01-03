import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserByUsername } from "@/services/user";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/utils";
import ContactNotification from "@/emails/templates/contact-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
	try {
		// Parse and validate the request body
		const reqData = await request.json();
		const { username, subject, props } = reqData;

		if (!username || !subject || !props) {
			return new NextResponse(
				{ error: "All field required" },
				{ status: 400 }
			);
		}
		logger.info("Request data: ", reqData);

		const resp = await getUserByUsername(username);

		// Check if user exists
		if (!resp.success) {
			return new NextResponse(
				{ error: "User not found" },
				{ status: 400 }
			);
		}
		logger.info("User resp: ", resp);

		// Get the user's primary email address
		const userEmail = resp?.data?.email;

		if (!userEmail) {
			return new NextResponse(
				{ error: "User email not found" },
				{ status: 400 }
			);
		}

		const { data, error } = await resend.emails.send({
			from: `${siteConfig.name} <onboarding@resend.dev>`,
			to: [userEmail],
			subject,
			react: (
				<ContactNotification
					name={props.name}
					email={props.email}
					message={props.message}
				/>
			),
		});

		if (error) {
			logger.error(error);
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ data, success: true }, { status: 200 });
	} catch (error) {
		logger.error("API route error:", error);

		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 }
		);
	}
}