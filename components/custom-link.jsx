import { DotsSixVertical, Envelope, Plus, X } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

import { defaultLink } from "@/schema/shared/links";
import { URLInput } from "./url-input";

export const LinkInput = ({ field, onChange, onRemove }) => {
	const handleChange = (key, value) => {
		onChange({ ...field, [key]: value });
	};

	return (
		<div className="grid">
			<div>
				<label>Icon</label>
				<div className="flex items-center space-x-2">
					{field.value && (
						<img
							src={`https://cdn.simpleicons.org/${field.value}`}
							alt="Icon"
							className="w-8 h-8"
						/>
					)}
					<Input
						{...field}
						placeholder="github"
						onChange={(event) => {
							onChange({
								...field,
								icon: event.target.value,
							});
						}}
					/>
				</div>
				<p className="text-sm text-muted-foreground">
					Powered by{" "}
					<a
						href="https://simpleicons.org/"
						target="_blank"
						rel="noopener noreferrer nofollow"
						className="font-medium"
					>
						Simple Icons
					</a>
				</p>
			</div>

			<URLInput
				id="link-url"
				value={field.name}
				onChange={(event) => {
					handleChange("url", event.target.value);
				}}
			/>

			<Button
				size="icon"
				variant="link"
				className="!ml-0 shrink-0"
				onClick={() => {
					onRemove(field.id);
				}}
			>
				<X />
			</Button>
		</div>
	);
};

export const CustomLink = ({ setValue, links, className }) => {
	console.log("Project links: ", links);
	const onAddCustomField = () => {
		setValue("links", [...links, defaultLink]);
	};

	const onChangeCustomField = (field) => {
		const index = links.findIndex((item) => item.id === field.id);
		const newCustomFields = JSON.parse(JSON.stringify(links));
		newCustomFields[index] = field;
		console.log("New link: ", newCustomFields);

		setValue("links", newCustomFields);
	};

	const onReorderCustomFields = (values) => {
		setValue("links", values);
	};

	const onRemoveCustomField = (id) => {
		setValue(
			"links",
			links.filter((field) => field.id !== id)
		);
	};

	return (
		<div className={cn("space-y-4", className)}>
			<AnimatePresence>
				{links?.map((field) => (
					<LinkInput
						key={field.id}
						field={field}
						onChange={onChangeCustomField}
						onRemove={onRemoveCustomField}
					/>
				))}
			</AnimatePresence>

			<Button variant="link" onClick={onAddCustomField}>
				<Plus className="mr-2" />
				<span>{`Add link`}</span>
			</Button>
		</div>
	);
};
