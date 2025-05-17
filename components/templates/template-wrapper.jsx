"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CONTAINER_CLASS } from "@/utils/constants";

// Import templates
import DefaultTemplate from "./default";
import VioletVista from "./violet-vista";
import Neomint from "./neomint";

const TEMPLATES = {
	default: DefaultTemplate,
	violetvista: VioletVista,
	neomint: Neomint,
};

export const TemplateWrapper = ({
	template = "default",
	data = {},
	className,
}) => {
	const Template = TEMPLATES[template] || TEMPLATES.default;
	return (
		<div
			className={cn(CONTAINER_CLASS, "py-6 md:py-8 lg:py-12", className)}
		>
			<Template {...data} />
		</div>
	);
};
