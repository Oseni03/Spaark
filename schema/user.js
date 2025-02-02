import { idSchema } from "./shared/id";
import { z } from "zod";

import { secretsSchema } from "./secrets";
import { createId } from "@paralleldrive/cuid2";

const subscriptionSchema = z
	.object({
		id: idSchema,
		type: z.string(),
		frequency: z.string(),
		status: z.string(),
		priceId: z.string(),
		startDate: z.date().nullable(),
		endDate: z.date().nullable(),
	})
	.nullable();

export const userSchema = z.object({
	id: idSchema,
	username: z.literal("").or(z.string().min(3).max(255)),
	email: z.string().email(),
	subscribed: z.boolean().default(false),
	userType: z.literal("").or(z.string().min(3).max(255)),
	createdAt: z.date(),
	updatedAt: z.date(),
	subscription: subscriptionSchema,
});

export const defaultUser = {
	id: createId(),
	username: "",
	email: "",
	subscribed: false,
	userType: "",
	createdAt: "",
	updatedAt: "",
	subscription: null,
};

export const userWithSecretsSchema = userSchema.merge(
	z.object({ secrets: secretsSchema })
);
