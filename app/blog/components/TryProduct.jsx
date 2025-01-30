import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/text";
import { siteConfig } from "@/config/site";

export function TryProduct() {
	return (
		<Link
			href={`${process.env.NEXT_PUBLIC_BASE_URL}/?utm_source=blog&utm_medium=${slugify(siteConfig.name)}`}
		>
			<div className="rounded-lg border-2 border-primary shadow-xl transition-transform duration-300 hover:scale-105">
				<Image
					src="/og.png"
					alt={siteConfig.name}
					width={320}
					height={240}
					className="w-full rounded-t-lg shadow"
				/>
				<p className="p-4 text-gray-700 dark:text-gray-300">
					{siteConfig.description}
				</p>
				<div className="px-4 pb-4">
					<Button className="w-full">Try {siteConfig.name}</Button>
				</div>
			</div>
		</Link>
	);
}
