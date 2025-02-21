import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser, updateUser, deleteUser } from "@/services/user";
import {
	createOrganization,
	deleteOrganization,
	updateOrganization,
} from "@/services/organization";
import { logger } from "@/lib/utils";

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
		logger.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400,
		});
	}
	logger.info("webhook body: ", body);
	logger.info("webhook evt data: ", evt.data);

	if (evt.type === "user.created") {
		const { id } = evt.data;
		if (!id) {
			return new Response("Error: User ID not found", {
				status: 400,
			});
		}

		logger.info("userId:", id);
		const user = await createUser(
			id,
			evt.data?.email_addresses[0]?.email_address
		);

		if (user.success) {
			logger.info("User creation successsful: ", user.data);
		}
	} else if (evt.type === "user.updated") {
		const { id } = evt.data;
		if (!id) {
			return new Response("Error: User ID not found", {
				status: 400,
			});
		}

		const user = await updateUser({
			id,
			email: evt.data?.email_addresses[0]?.email_address,
		});

		if (user.success) {
			logger.info("User update successsful: ", user.data);
		}
	} else if (evt.type === "user.deleted") {
		const { deleted, id } = evt.data;
		if (deleted) {
			const result = await deleteUser(id);
			if (result.success) {
				logger.info("User deleted");
			}
		}
	} else if (evt.type === "session.created") {
		const { status, user_id } = evt.data;
		if (status !== "active") return;
		if (!user_id) return;

		logger.info("User logged in: ", user_id);
	} else if (evt.type === "organization.created") {
		const { id, created_by } = evt.data;
		if (!id || !created_by) {
			return new Response("Error: Missing organization data", {
				status: 400,
			});
		}

		const org = await createOrganization(evt.data, created_by);
		if (org.success) {
			logger.info("Organization creation successful:", org.data);
		}
	} else if (evt.type === "organization.deleted") {
		const { deleted, id } = evt.data;
		if (deleted && id) {
			const result = await deleteOrganization(id);
			if (result.success) {
				logger.info(`Organization ${id} deleted successfully`);
			}
		}
	} else if (evt.type === "organization.updated") {
		const { id } = evt.data;
		if (!id) {
			return new Response("Error: Missing organization ID", {
				status: 400,
			});
		}

		const result = await updateOrganization(evt.data);
		if (result.success) {
			logger.info(`Organization ${id} updated successfully`);
		}
	}

	return new Response("Webhook received", { status: 200 });
}
