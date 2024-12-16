import { idSchema } from "./shared/id";
import { z } from "zod";

import { secretsSchema } from "./secrets";
import { createId } from "@paralleldrive/cuid2";

export const userSchema = z.object({
	id: idSchema,
	username: z.literal("").or(z.string().min(3).max(255)),
	email: z.string().email(),
	subscribed: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const defaultUser = {
	id: createId(),
	username: "",
	email: "",
	subscribed: false,
	createdAt: "",
	updatedAt: "",
};

export const userWithSecretsSchema = userSchema.merge(
	z.object({ secrets: secretsSchema })
);
