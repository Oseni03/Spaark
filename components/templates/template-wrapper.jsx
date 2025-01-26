"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Import templates
import DefaultTemplate from "./default";
// import MinimalTemplate from "./minimal";
// import ModernTemplate from "./modern";
// import ClassicTemplate from "./classic";

const TEMPLATES = {
	default: DefaultTemplate,
	// minimal: MinimalTemplate,
	// modern: ModernTemplate,
	// classic: ClassicTemplate,
};

export const getTemplate = (template) => {
	return TEMPLATES[template] || TEMPLATES.default;
};

export const TemplateWrapper = ({
	template = "default",
	data = {},
	className,
}) => {
	const Template = getTemplate(template);

	return (
		<div
			className={cn(
				"w-full h-full overflow-auto scrollbar-hide px-6 py-8",
				className
			)}
		>
			<AnimatePresence>
				<motion.div
					layout
					initial={{ opacity: 0, x: -200, y: 0 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -200 }}
					className="pointer-events-auto w-full"
				>
					<Template {...data} />
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
