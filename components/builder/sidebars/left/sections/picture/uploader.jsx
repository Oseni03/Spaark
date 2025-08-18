"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

export default function Uploader({ defaultValue, defaultName, setValue }) {
	let name = defaultName || "image";
	const [media, setMedia] = useState(defaultValue || "");
	const inputRef = useRef(null);
	const [dragActive, setDragActive] = useState(false);

	const handleUpload = async (file) => {
		if (file) {
			if (file.size / 1024 / 1024 > 50) {
				toast.error("File size too big (max 50MB)");
				return;
			}

			if (
				!file.type.startsWith("image/") &&
				!file.type.startsWith("video/")
			) {
				toast.error("Invalid file type (must be an image or video)");
				return;
			}
			logger.info("File type:", file.type);

			if (file.type.startsWith("image/")) {
				name = "image";
			} else if (file.type.startsWith("video/")) {
				name = "video";
			}

			const loadingToast = toast.loading("Uploading file...");

			try {
				const response = await fetch("/api/file-upload", {
					method: "POST",
					body: file,
				});

				if (!response.ok) {
					throw new Error("Failed to upload file");
				}

				const { blob } = await response.json();
				setMedia(blob.url);
				setValue(name, blob.url);
				toast.dismiss(loadingToast);
				toast.success("File uploaded successfully");
				logger.info("File uploaded: ", name, blob.url);
			} catch (error) {
				logger.error("Upload error:", error);
				toast.dismiss(loadingToast);
				toast.error("Failed to upload file");
			}
		}
	};

	return (
		<div>
			<label
				htmlFor={`${name}-upload`}
				className={
					"group relative mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 aspect-video max-w-screen-md"
				}
			>
				<div
					className="absolute z-[5] h-full w-full rounded-md"
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDragActive(true);
					}}
					onDragEnter={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDragActive(true);
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDragActive(false);
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDragActive(false);

						const file =
							e.dataTransfer.files && e.dataTransfer.files[0];
						inputRef.current.files = e.dataTransfer.files; // set input file to dropped file
						handleUpload(file);
					}}
				/>
				<div
					className={`${
						dragActive ? "border-2 border-black" : ""
					} absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
						media
							? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
							: "bg-white opacity-100 hover:bg-gray-50"
					}`}
				>
					<svg
						className={`${
							dragActive ? "scale-110" : "scale-100"
						} h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
						<path d="M12 12v9"></path>
						<path d="m16 16-4-4-4 4"></path>
					</svg>
					<p className="mt-2 text-center text-sm text-gray-500">
						Drag and drop or click to upload.
					</p>
					<p className="mt-2 text-center text-sm text-gray-500">
						Max file size: 50MB
					</p>
					<span className="sr-only">Media upload</span>
				</div>
				{media &&
					(name === "video" ? (
						<video
							src={media}
							controls
							className="h-full w-full rounded-md object-cover"
						/>
					) : (
						<img
							src={media}
							alt="Preview"
							className="h-full w-full rounded-md object-cover"
						/>
					))}
			</label>
			<div className="mt-1 flex rounded-md shadow-sm">
				<input
					id={`${name}-upload`}
					ref={inputRef}
					name={name}
					type="file"
					accept="image/*,video/*"
					className="sr-only"
					onChange={(e) => {
						const file =
							e.currentTarget.files && e.currentTarget.files[0];
						handleUpload(file);
					}}
				/>
			</div>
		</div>
	);
}
