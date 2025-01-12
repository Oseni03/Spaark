"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { FeaturedImage } from "./components/featured-image";
import { RichInput } from "@/components/ui/rich-input";

const TitleInput = ({ title, setTitle }) => {
	return (
		<div className="px-4 pt-8">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Your Post Title"
				className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300 focus:ring-0 p-0"
				aria-label="Post title"
			/>
			<div className="h-px bg-gray-100 mt-8" />
		</div>
	);
};

const Page = () => {
	const [title, setTitle] = useState("");
	const [featuredImage, setFeaturedImage] = useState(null);
	const [content, setContent] = useState(null);

	const updateDocumentTitle = React.useCallback(() => {
		document.title = title || "Untitled Post";
	}, [title]);

	React.useEffect(() => {
		updateDocumentTitle();
	}, [title, updateDocumentTitle]);

	return (
		<Card className={`w-full transition-all duration-300 border-0`}>
			<FeaturedImage image={featuredImage} setImage={setFeaturedImage} />
			<TitleInput title={title} setTitle={setTitle} />

			<div className={"min-h-[500px]"}>
				<RichInput
					content={content}
					onChange={setContent}
					className="min-h-[500px]"
					editorClassName="min-h-[500px]"
				/>
			</div>
		</Card>
	);
};

export default Page;
