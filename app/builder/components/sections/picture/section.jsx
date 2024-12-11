import { Trash, UploadSimple } from "@phosphor-icons/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const PictureSection = ({ control, setValue }) => {
	const [localPictureUrl, setLocalPictureUrl] = useState("");

	const onSelectImage = async (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			// Simulate an upload function (replace with real upload logic).
			const response = { data: URL.createObjectURL(file) }; // Mock URL for local files.
			setLocalPictureUrl(response.data);
			setValue("picture", response.data); // Update form value.
		}
	};

	const onAvatarClick = () => {
		if (localPictureUrl) {
			setLocalPictureUrl("");
			setValue("picture", ""); // Clear the form value.
		} else {
			document.getElementById("image-upload")?.click();
		}
	};

	return (
		<Controller
			name="picture"
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
						<Label htmlFor="image-upload">{`Picture/Logo`}</Label>
						<div className="flex items-center gap-x-2">
							<input
								id="image-upload"
								type="file"
								onChange={onSelectImage}
								hidden
							/>
							<Input
								id="picture-url"
								placeholder="https://..."
								value={localPictureUrl || field.value}
								onChange={(e) => {
									const url = e.target.value;
									setLocalPictureUrl(url);
									setValue("picture", url);
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
