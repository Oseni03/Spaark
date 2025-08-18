import { useState, useCallback } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { defaultLink } from "@/schema/shared/links";
import { URLInput } from "./url-input";
import { createId } from "@paralleldrive/cuid2";

const LinkInput = ({ field, onChange, onRemove }) => {
	const handleChange = useCallback(
		(key, value) => {
			onChange({ ...field, [key]: value });
		},
		[field, onChange]
	);

	return (
		<motion.div
			className="flex space-x-1 items-start"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			layout
		>
			<div>
				<div className="flex items-center space-x-1">
					{field.icon && (
						<img
							src={`https://cdn.simpleicons.org/${field.icon}`}
							alt="Icon"
							className="w-8 h-8"
						/>
					)}
					<Input
						value={field.icon || ""} // Handle null value
						placeholder="Icon name (e.g., github)"
						onChange={(e) =>
							handleChange("icon", e.target.value || null)
						} // Set to null if empty
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
				id={`url-input-${field.id}`}
				field={field}
				onChange={handleChange}
				placeholder="Enter URL"
				aria-label="Link URL"
			/>

			<Button
				size="icon"
				variant="link"
				className="!ml-0 shrink-0"
				onClick={() => onRemove(field.id)}
			>
				<X />
			</Button>
		</motion.div>
	);
};

export const CustomLink = ({
	setValue,
	links: initialLinks = [],
	className,
}) => {
	const [links, setLinks] = useState(initialLinks);

	const onAddCustomField = useCallback(() => {
		const newLink = { ...defaultLink, id: createId() };
		const updatedLinks = [...links, newLink];
		setLinks(updatedLinks);
		setValue("links", updatedLinks);
	}, [links, setValue]);

	const onChangeCustomField = useCallback(
		(field) => {
			const updatedLinks = links.map((item) =>
				item.id === field.id ? field : item
			);
			setLinks(updatedLinks);
			setValue("links", updatedLinks);
		},
		[links, setValue]
	);

	const onRemoveCustomField = useCallback(
		(id) => {
			const updatedLinks = links.filter((field) => field.id !== id);
			setLinks(updatedLinks);
			setValue("links", updatedLinks);
		},
		[links, setValue]
	);

	return (
		<div className={cn("space-y-4", className)}>
			<AnimatePresence>
				{links.map((field) => (
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
