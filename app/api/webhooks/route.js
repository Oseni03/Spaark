import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUserBasics } from "@/services/user";

export async function POST(req) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET;
	if (!SIGNING_SECRET) {
		throw new Error(
			"Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	// Create new Svix instance with secret
	const wh = new Webhook(SIGNING_SECRET);

	// Get headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing Svix headers", {
			status: 400,
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt;
	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		});
	} catch (err) {
		console.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400,
		});
	}
	console.log("webhook body: ", body);
	console.log("webhook evt data: ", evt.data);

	if (evt.type === "user.created") {
		const { id } = evt.data;
		if (!id) {
			return new Response("Error: User ID not found", {
				status: 400,
			});
		}

		console.log("userId:", id);
		const basics = await createUserBasics(id);

		if (basics.success) {
			console.log("User basics creation successful: ", basics);
		}
	} else if (evt.type === "session.created") {
		const { status, user_id } = evt.data;
		if (status !== "active") return;
		if (!user_id) return;

		console.log("User logged in: ", user_id);
	}

	return new Response("Webhook received", { status: 200 });
}
