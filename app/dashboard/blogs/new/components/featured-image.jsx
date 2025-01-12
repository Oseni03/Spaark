"use client";

import { useState, useCallback } from "react";
import { Camera, X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const FeaturedImage = ({ image, setImage }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				const file = e.dataTransfer.files[0];
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (event) => {
						setImage({
							url: event.target.result,
							alt: file.name,
							title: file.name,
						});
					};
					reader.readAsDataURL(file);
				}
			}
		},
		[setImage]
	);

	const handleDrag = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setIsDragging(true);
		} else if (e.type === "dragleave") {
			setIsDragging(false);
		}
	}, []);

	const handleFileSelect = useCallback(
		(e) => {
			if (e.target.files && e.target.files[0]) {
				const file = e.target.files[0];
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (event) => {
						setImage({
							url: event.target.result,
							alt: file.name,
							title: file.name,
						});
					};
					reader.readAsDataURL(file);
				}
			}
		},
		[setImage]
	);

	const removeImage = () => {
		setImage(null);
	};

	if (!image) {
		return (
			<Dialog>
				<DialogTrigger>
					<span className="flex gap-1 text-muted-foreground font-semibold">
						<Plus /> Add feature image
					</span>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add feature image</DialogTitle>
						<div>
							<label
								className="group relative flex cursor-pointer flex-col items-center justify-center aspect-video max-w-screen-lg border-gray-300 bg-white hover:border-gray-400 transition-colors shadow-sm"
								htmlFor="featured-image"
							>
								<div
									className="absolute z-[5] h-full w-full rounded-md"
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
								/>
								<div
									className={`${isDragging ? "border-blue-500 bg-blue-50" : ""} 
						absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all`}
								>
									<Camera className="w-12 h-12 text-gray-400 mb-4" />

									<p className="mt-2 text-center text-sm text-gray-500">
										Drag and drop or click to upload.
									</p>
								</div>
							</label>
							<div className="mt-1 flex rounded-md shadow-sm">
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleFileSelect}
									id="featured-image"
								/>
							</div>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<div
			className="relative max-w-screen-lg aspect-video group mx-auto"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<img
				src={image.url}
				alt={image.alt}
				className="w-full h-full object-cover rounded-lg"
			/>

			{/* Overlay and controls */}
			<div
				className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity rounded-lg
        ${isHovering ? "opacity-100" : "opacity-0"}
      `}
			>
				<div className="absolute top-4 right-4 flex gap-2">
					<label className="cursor-pointer">
						<Button
							variant="secondary"
							size="sm"
							className="bg-white hover:bg-gray-100"
						>
							<Upload className="w-4 h-4 mr-2" />
							Change
						</Button>
						<input
							type="file"
							className="hidden"
							accept="image/*"
							onChange={handleFileSelect}
						/>
					</label>
					<Button
						variant="secondary"
						size="sm"
						className="bg-white hover:bg-gray-100"
						onClick={removeImage}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* Image caption/alt text */}
				<div className="absolute bottom-4 left-4 right-4">
					<input
						type="text"
						value={image.alt}
						onChange={(e) =>
							setImage({ ...image, alt: e.target.value })
						}
						placeholder="Write a caption for your image (optional)"
						className="w-full px-3 py-2 bg-white bg-opacity-90 rounded-md text-sm"
					/>
				</div>
			</div>
		</div>
	);
};
