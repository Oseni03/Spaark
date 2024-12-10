import { Tag } from "@phosphor-icons/react";
import { urlSchema } from "@/schema/shared/url";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip } from "./ui/tooltip";
import React, { forwardRef, useMemo } from "react";

export const URLInput = forwardRef(function URLInput(
	{ id, value, placeholder, onChange },
	ref
) {
	// Validate if the URL is correct
	const hasError = useMemo(
		() => !urlSchema.safeParse(value?.href).success,
		[value?.href]
	);

	return (
		<div>
			<div className="flex gap-x-1">
				{/* URL Input Field */}
				<Input
					ref={ref}
					id={id}
					value={value?.href || ""}
					className={`flex-1 ${hasError ? "border-red-500" : ""}`}
					hasError={hasError}
					placeholder={placeholder || "https://example.com"}
					onChange={(event) =>
						onChange({ ...value, href: event.target.value })
					}
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
							value={value?.label || ""}
							placeholder="Label (optional)"
							onChange={(event) =>
								onChange({
									...value,
									label: event.target.value,
								})
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
