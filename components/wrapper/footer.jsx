import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="border-t bg-background/50 backdrop-blur-sm">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					{/* Logo and Copyright */}
					<div className="flex items-center gap-2">
						<Image
							src={siteConfig.icon}
							alt={siteConfig.name}
							width={24}
							height={24}
							className="text-black dark:text-white"
						/>
						<span className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} {siteConfig.name}. All
							rights reserved.
						</span>
					</div>

					{/* Navigation Links */}
					<nav className="flex items-center gap-6">
						<Link
							href="/"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Home
						</Link>
						<Link
							href="/#pricing"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Pricing
						</Link>
						<Link
							href="/privacy-policy"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
