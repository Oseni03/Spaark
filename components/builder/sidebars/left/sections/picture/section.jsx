import { Trash, UploadSimple } from "@phosphor-icons/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createId } from "@paralleldrive/cuid2";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

export const PictureSection = ({
	control,
	setValue,
	name = "picture",
	id = createId(),
}) => {
	const [localPictureUrl, setLocalPictureUrl] = useState("");

	const onSelectImage = async (event) => {
		try {
			// Check if files exist and at least one file is selected
			if (!event.target.files || event.target.files.length === 0) {
				throw new Error("No file selected.");
			}

			// Extract the selected file
			const file = event.target.files[0];

			// Validate file type (optional, add based on your requirements)
			if (!file.type.startsWith("image/")) {
				throw new Error("Selected file is not an image.");
			}

			// Prepare headers and body for the upload request
			const headers = {
				"Content-Type": file.type || "application/octet-stream",
				"x-vercel-filename": file.name || `image-${Date.now()}.png`,
			};

			// Send the file to the server
			const response = await fetch("/api/file-upload", {
				method: "POST",
				headers,
				body: file,
			});

			// Check if the upload was successful
			if (!response.ok) {
				throw new Error(`File upload failed: ${response.statusText}`);
			}

			// Extract the response JSON
			const { blob } = await response.json();

			// Update local state and form value
			if (blob.url) {
				setLocalPictureUrl(blob.url);
				setValue(name, blob.url);
			} else {
				throw new Error("File URL not returned from the server.");
			}
		} catch (error) {
			// Handle and log any errors
			logger.error("Error during image upload:", error);
			toast.error(
				error.message ||
					"An unexpected error occurred while uploading the image."
			);
		}
	};

	const onAvatarClick = () => {
		if (localPictureUrl) {
			setLocalPictureUrl("");
			setValue(name, ""); // Clear the form value.
		} else {
			document.getElementById(id)?.click();
		}
	};

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className="flex items-center gap-x-4">
					<div
						className="group relative cursor-pointer"
						onClick={onAvatarClick}
					>
						<Avatar className="size-14 bg-secondary">
							<AvatarImage src={localPictureUrl || field.value} />
						</Avatar>
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
							{localPictureUrl || field.value ? (
								<Trash size={16} weight="bold" />
							) : (
								<UploadSimple size={16} weight="bold" />
							)}
						</div>
					</div>
					<div className="flex w-full flex-col gap-y-1.5 mb-3">
						<Label htmlFor={id}>{`Picture/Logo`}</Label>
						<div className="flex items-center gap-x-2">
							<input
								id={id}
								type="file"
								onChange={onSelectImage}
								hidden
							/>
							<Input
								id={`${id}-url`}
								placeholder="https://..."
								value={localPictureUrl || field.value}
								onChange={(e) => {
									const url = e.target.value;
									setLocalPictureUrl(url);
									setValue(name, url);
								}}
								className="border rounded px-2 py-1"
								{...field}
							/>
							{fieldState.error && (
								<p className="text-red-500 text-sm">
									{fieldState.error.message}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		/>
	);
};
