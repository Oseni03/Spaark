import { toast } from "sonner";

export const handleUpload = async (file) => {
	try {
		if (file.size / 1024 / 1024 > 5) {
			toast.error("File size too big (max 5MB)");
		} else if (
			!file.type.includes("png") &&
			!file.type.includes("jpg") &&
			!file.type.includes("jpeg")
		) {
			toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
		} else {
			const resp = await fetch("/api/file-upload", {
				method: "POST",
				headers: {
					"content-type": file?.type || "application/octet-stream",
					"x-vercel-filename":
						file?.name || `image-${Date.now()}.png`,
				},
				body: file,
			});

			const { blob } = await resp.json();
			return { success: true, data: blob };
		}
	} catch (error) {
		return;
	}
};
