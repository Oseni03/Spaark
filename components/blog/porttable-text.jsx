import React from "react";
import { PortableText as _PortableText } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { LinkIcon } from "lucide-react";
import { extractTextFromPortableTextBlock, slugify } from "@/utils/text";

export const PortableText = (body) => {
	return (
		<_PortableText
			value={body}
			components={{
				block: {
					h2: createHeadingComponent("h2"),
					h3: createHeadingComponent("h3"),
				},
				types: {
					image: ({ value }) => {
						// https://www.sanity.io/answers/how-to-get-the-width-height-or-dimensions-of-uploaded-image-with-sanity-and-next-js-to-prevent-cls
						const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/;

						const decodeAssetId = (id) => {
							const match = pattern.exec(id);
							if (!match) {
								console.error(`Invalid asset ID: ${id}`);
								return null;
							}
							const [, assetId, dimensions, format] = match;
							const [width, height] = dimensions
								.split("x")
								.map((v) => Number.parseInt(v, 10));

							return {
								assetId,
								dimensions: {
									width,
									height,
								},
								format,
							};
						};

						const { dimensions } =
							decodeAssetId(value.asset?._id) || {};

						return (
							<Image
								src={builder.image(value).width(800).url()}
								alt={value.alt || ""}
								width={dimensions?.width || 800}
								height={dimensions?.height || 600}
								className="h-auto w-full"
							/>
						);
					},
				},
				marks: {
					link: ({ children, value }) => {
						const href = value?.href;
						return (
							<Link
								href={href}
								className="font-semibold text-blue-600 hover:underline"
							>
								{children}
							</Link>
						);
					},
				},
			}}
		/>
	);
};

const createHeadingComponent = (Tag) => {
	const HeadingComponent = ({ children, value }) => {
		const text = extractTextFromPortableTextBlock(value);
		const id = slugify(text);

		return (
			<Tag id={id} className="group relative flex items-center">
				<Link href={`#${id}`} className="flex items-center">
					<span className="absolute left-0 -translate-x-full pr-2 opacity-0 transition-opacity group-hover:opacity-100">
						<LinkIcon className="size-4" />
					</span>
					{children}
				</Link>
			</Tag>
		);
	};

	HeadingComponent.displayName = `Heading${Tag}`;
	return HeadingComponent;
};
