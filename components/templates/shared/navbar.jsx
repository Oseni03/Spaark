import { Dock, DockIcon } from "@/components/magicui/dock";
import ModeToggle from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
	GithubLogo,
	LinkedinLogo,
	XLogo,
	YoutubeLogo,
} from "@phosphor-icons/react";
import { Pen } from "lucide-react";
import Image from "next/image";

export default function PortfolioNavbar({ profile }) {
	const { isSignedIn } = useUser();
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-6 flex flex-col origin-bottom h-full max-h-14">
			<div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
			<Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
				{siteConfig.navbar.map((item) => (
					<DockIcon key={item.href}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={item.href}
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"size-12"
									)}
								>
									<item.icon className="size-4" />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>{item.label}</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				))}
				{isSignedIn && (
					<DockIcon key={"builder"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={"/builder"}
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"size-12"
									)}
								>
									<Pen size={5} />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Builder</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				)}

				<Separator orientation="vertical" className="h-full" />
				{Object.entries(profile)
					.filter(([_, social]) => social.visible)
					.map(([network, social]) => (
						<DockIcon key={network}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={social.url}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											"size-12"
										)}
									>
										{social.network === "github" && (
											<GithubLogo size={4} />
										)}
										{social.network === "linkedin" && (
											<LinkedinLogo size={4} />
										)}
										{social.network === "x" && (
											<XLogo size={4} />
										)}
										{social.network === "youtube" && (
											<YoutubeLogo size={4} />
										)}
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{social.network
											.charAt(0)
											.toLocaleUpperCase() +
											social.network.slice(1)}
									</p>
								</TooltipContent>
							</Tooltip>
						</DockIcon>
					))}
				<Separator orientation="vertical" className="h-full py-2" />
				<DockIcon>
					<Tooltip>
						<TooltipTrigger asChild>
							<ModeToggle />
						</TooltipTrigger>
						<TooltipContent>
							<p>Theme</p>
						</TooltipContent>
					</Tooltip>
				</DockIcon>
			</Dock>
			<Link
				href={process.env.NEXT_PUBLIC_APP_URL}
				target="_blank" // Corrected here
				rel="noopener noreferrer" // Added for security best practices
				className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
			>
				<Image
					src="/spaark.svg"
					alt="Spaark Logo"
					width={32}
					height={32}
				/>
				Made with Spaark
			</Link>
		</div>
	);
}
