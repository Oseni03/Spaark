import { Tag } from "@phosphor-icons/react";
import { urlSchema } from "@/schema/shared/url";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip } from "./ui/tooltip";
import React, { forwardRef, useMemo } from "react";

export const URLInput = forwardRef(function URLInput(
	{ id, field, placeholder, onChange },
	ref
) {
	// Validate if the URL is correct
	const hasError = useMemo(
		() => !urlSchema.safeParse(field?.url).success,
		[field?.url]
	);

	return (
		<div>
			<div className="flex gap-x-1">
				{/* URL Input Field */}
				<Input
					ref={ref}
					id={id}
					value={field?.url || ""}
					className={`flex-1 ${hasError ? "border-red-500" : ""}`}
					placeholder={placeholder || "https://example.com"}
					onChange={(event) => onChange("url", event.target.value)}
				/>

				{/* Label Popover */}
				<Popover>
					<Tooltip content="Add a label">
						<PopoverTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								aria-label="Add label"
							>
								<Tag />
							</Button>
						</PopoverTrigger>
					</Tooltip>
					<PopoverContent className="p-1.5">
						<Input
							value={field?.label || ""}
							placeholder="Label (optional)"
							onChange={(event) =>
								onChange("label", event.target.value)
							}
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* Error Message */}
			{hasError && (
				<small className="text-red-500 opacity-75">
					URL must start with `https://`
				</small>
			)}
		</div>
	);
});
