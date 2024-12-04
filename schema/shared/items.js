import { z } from "zod";

import { idSchema } from "./id";

// Schema
export const itemSchema = z.object({
	id: idSchema,
	visible: z.boolean(),
});

// Defaults
export const defaultItem = {
	id: "",
	visible: true,
};
