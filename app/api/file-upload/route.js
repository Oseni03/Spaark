import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";

export const runtime = "edge";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"video/mp4",
	"video/webm",
	"video/ogg",
];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB for larger video files

export async function POST(req) {
	try {
		// Check for required environment variable
		if (!process.env.BLOB_READ_WRITE_TOKEN) {
			return new Response("Missing BLOB_READ_WRITE_TOKEN configuration", {
				status: 401,
			});
		}

		const file = req.body;
		const contentType =
			req.headers.get("content-type") || "application/octet-stream";

		// Validate content type
		if (!ALLOWED_MIME_TYPES.includes(contentType)) {
			return new Response("Unsupported file type", { status: 415 });
		}

		// Check file size (if available)
		const contentLength = parseInt(
			req.headers.get("content-length") || "0"
		);
		if (contentLength > MAX_FILE_SIZE_BYTES) {
			return new Response("File too large", { status: 413 });
		}

		// Generate unique filename
		const extension = contentType.split("/")[1];
		const filename = `${nanoid()}.${extension}`;

		// Upload to Vercel Blob
		const blob = await put(filename, file, {
			contentType,
			access: "public",
			// Optional: Add metadata if needed
			metadata: {
				uploadedAt: new Date().toISOString(),
			},
		});

		return NextResponse.json({ blob });
	} catch (error) {
		logger.error("Upload error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
