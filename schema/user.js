import { idSchema } from "./shared/id";
import { z } from "zod";

import { secretsSchema } from "./secrets";

export const usernameSchema = z
	.string()
	.min(3)
	.max(255)
	.regex(/^[\d._a-z-]+$/, {
		message:
			"Usernames can only contain lowercase letters, numbers, periods, hyphens, and underscores.",
	});

export const userSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255),
	picture: z.literal("").or(z.null()).or(z.string().url()),
	username: usernameSchema,
	email: z.string().email(),
	locale: z.string().default("en-US"),
	emailVerified: z.boolean().default(false),
	twoFactorEnabled: z.boolean().default(false),
	provider: z.enum(["email", "github", "google"]).default("email"),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const userWithSecretsSchema = userSchema.merge(
	z.object({ secrets: secretsSchema })
);
