import { Trash, UploadSimple } from "@phosphor-icons/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { uploadImage } from "@/lib/upload-image";
import { Aperture } from "lucide-react";

const PictureOptions = () => {
	// Simple version of PictureOptions component
	return (
		<div className="p-4 space-y-4">
			<h3 className="text-md font-medium">{`Picture Options`}</h3>
			{/* Add your picture options here */}
		</div>
	);
};

export const PictureSection = () => {
	// const { uploadImage } = useUploadImage();
	const [pictureUrl, setPictureUrl] = useState("");

	const onSelectImage = async (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const response = await uploadImage(file);
			setPictureUrl(response.data);
		}
	};

	const onAvatarClick = () => {
		if (pictureUrl) {
			setPictureUrl("");
		} else {
			document.getElementById("image-upload")?.click();
		}
	};

	return (
		<div className="flex items-center gap-x-4">
			<div
				className="group relative cursor-pointer"
				onClick={onAvatarClick}
			>
				<Avatar className="size-14 bg-secondary">
					<AvatarImage src={pictureUrl} />
				</Avatar>
				{pictureUrl ? (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
						<Trash size={16} weight="bold" />
					</div>
				) : (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
						<UploadSimple size={16} weight="bold" />
					</div>
				)}
			</div>
			<div className="flex w-full flex-col gap-y-1.5 mb-3">
				<Label htmlFor="image-upload">{`Picture`}</Label>
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
						value={pictureUrl}
						onChange={(event) => {
							setPictureUrl(event.target.value);
						}}
					/>
					{pictureUrl && (
						<Popover>
							<PopoverTrigger asChild>
								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className={cn(
										buttonVariants({
											size: "icon",
											variant: "ghost",
										})
									)}
								>
									<Aperture />
								</motion.button>
							</PopoverTrigger>
							<PopoverContent className="w-[360px]">
								<PictureOptions />
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>
		</div>
	);
};
