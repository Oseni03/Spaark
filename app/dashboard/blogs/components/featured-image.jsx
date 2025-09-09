"use client";

import { useState, useCallback } from "react";
import { Camera, X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
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

	const handleUpload = async (file) => {
		if (!file) return;

		if (file.size / 1024 / 1024 > 50) {
			toast.error("File size too big (max 50MB)");
			return;
		}

		if (!file.type.startsWith("image/")) {
			toast.error("Invalid file type (must be an image)");
			return;
		}

		const loadingToast = toast.loading("Uploading image...");

		try {
			const response = await fetch("/api/file-upload", {
				method: "POST",
				body: file,
			});

			if (!response.ok) {
				throw new Error("Failed to upload file");
			}

			const { blob } = await response.json();
			setImage(blob.url);
			toast.dismiss(loadingToast);
			toast.success("Image uploaded successfully");
			logger.info("Image uploaded:", blob.url);
		} catch (error) {
			logger.error("Upload error:", error);
			toast.dismiss(loadingToast);
			toast.error("Failed to upload image");
		}
	};

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				const file = e.dataTransfer.files[0];
				handleUpload(file);
			}
		},
		[setIsDragging]
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

	const handleFileSelect = useCallback((e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			handleUpload(file);
		}
	}, []);

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
						<DialogTitle>Upload Feature Image</DialogTitle>
						<DialogDescription>
							Drag and drop an image or click to select a file.
						</DialogDescription>
					</DialogHeader>
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
								className={`${
									isDragging
										? "border-blue-500 bg-blue-50"
										: ""
								} 
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
				src={image}
				alt={"Blog image"}
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
						<Button variant="secondary" size="sm">
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
					<Button variant="secondary" size="sm" onClick={removeImage}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* Image caption/alt text */}
				{/* <div className="absolute bottom-4 left-4 right-4">
					<input
						type="text"
						value={image.alt}
						onChange={(e) =>
							setImage({ ...image, alt: e.target.value })
						}
						placeholder="Write a caption for your image (optional)"
						className="w-full px-3 py-2 bg-white bg-opacity-90 rounded-md text-sm"
					/>
				</div> */}
			</div>
		</div>
	);
};
