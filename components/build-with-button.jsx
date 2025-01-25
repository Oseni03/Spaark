import Link from "next/link";
import { siteConfig } from "@/config/site";
import { RainbowButton } from "@/components/ui/rainbow-button";

export const BuildWithButton = () => {
	return (
		<Link
			href={siteConfig.url}
			target="_blank"
			className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
		>
			<RainbowButton className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
				Built with {siteConfig.name}
			</RainbowButton>
		</Link>
	);
};
