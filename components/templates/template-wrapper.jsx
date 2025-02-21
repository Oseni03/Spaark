"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CONTAINER_CLASS } from "@/utils/constants";

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
		<div className={cn("relative w-full min-h-screen", className)}>
			<div className={cn(CONTAINER_CLASS, "py-6 md:py-8 lg:py-12")}>
				<AnimatePresence>
					<motion.div
						layout
						initial={{ opacity: 0, x: -20, y: 0 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="w-full"
					>
						<Template {...data} />
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
