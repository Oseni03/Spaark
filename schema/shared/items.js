import { z } from "zod";

import { idSchema } from "./id";
import { createId } from "@paralleldrive/cuid2";

// Schema
export const itemSchema = z.object({
	id: idSchema,
	visible: z.boolean(),
});

// Defaults
export const defaultItem = {
	id: createId(),
	visible: true,
};
