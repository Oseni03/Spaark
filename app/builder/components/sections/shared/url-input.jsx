import { Tag } from "@phosphor-icons/react";
import { urlSchema } from "@/schema/shared/url";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { forwardRef, useMemo } from "react";

export const URLInput = forwardRef(function URLInput(
	{ id, value = { href: "", label: "" }, placeholder, onChange },
	ref
) {
	const hasError = useMemo(
		() => !urlSchema.safeParse(value.href).success,
		[value.href]
	);

	return (
		<div>
			<div className="flex gap-x-1">
				<Input
					ref={ref}
					id={id}
					value={value.href}
					className={`flex-1 ${hasError ? "border-red-500" : ""}`}
					placeholder={placeholder}
					onChange={(event) => {
						onChange({ ...value, href: event.target.value });
					}}
				/>

				<Popover>
					<Tooltip content="Label">
						<PopoverTrigger asChild>
							<Button size="icon" variant="ghost">
								<Tag />
							</Button>
						</PopoverTrigger>
					</Tooltip>
					<PopoverContent className="p-1.5">
						<Input
							value={value.label}
							placeholder="Label"
							onChange={(event) => {
								onChange({
									...value,
									label: event.target.value,
								});
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			{hasError && (
				<small className="opacity-75 text-red-500">
					URL must start with https://
				</small>
			)}
		</div>
	);
});
