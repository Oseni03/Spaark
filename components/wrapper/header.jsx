"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ModeToggle from "../mode-toggle";
import { siteConfig } from "@/config/site";
import { UserDropdown } from "../user-dropdown";
import { useSession } from "@/lib/auth-client";

export const Header1 = () => {
	const [isOpen, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const { data, isPending } = useSession();
	const user = !isPending ? data?.user : null;

	const navItems = useMemo(
		() => [
			{
				title: "Features",
				href: "/#features",
			},
			{
				title: "Contact us",
				href: "/contact-us",
			},
			{
				title: "Pricing",
				href: "/#pricing",
			},
			{
				title: "Feature Requests",
				href: "/feature-requests",
			},
		],
		[]
	);

	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`w-full z-40 fixed top-0 left-0 border-b backdrop-blur-md transition-colors duration-200 ${
				scrolled ? "bg-background/60" : "bg-background"
			}`}
		>
			<div className="container relative mx-auto min-h-14 flex items-center justify-between gap-4">
				{/* Logo Section */}
				<div className="flex-none">
					<Link href={"/"}>
						<Button variant="icon">
							<span className="text-2xl font-bold">
								{siteConfig.name}
							</span>
						</Button>
					</Link>
				</div>

				{/* Navigation Section - Centered */}
				<div className="hidden lg:flex flex-auto justify-center">
					<NavigationMenu>
						<NavigationMenuList className="flex gap-4">
							{navItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuLink>
										<Link href={item.href}>
											<Button variant="ghost">
												{item.title}
											</Button>
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{/* User Controls Section */}
				<div className="flex items-center gap-4">
					<ModeToggle />
					<div className="border-r hidden md:inline"></div>
					{isPending ? (
						<div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
					) : user ? (
						<>
							<UserDropdown />
							<Link href={"/dashboard/portfolios"}>
								<Button size="sm">Dashboard</Button>
							</Link>
						</>
					) : (
						<>
							<Link href={"/sign-in"}>
								<Button variant="outline">Sign in</Button>
							</Link>
							<Link href={"/sign-up"}>
								<Button>Get started</Button>
							</Link>
						</>
					)}
					<div className="flex lg:hidden">
						<Button
							variant="ghost"
							onClick={() => setOpen(!isOpen)}
						>
							{isOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="absolute top-14 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
						{navItems.map((item) => (
							<Link
								key={item.title}
								href={item.href}
								className="flex justify-between items-center"
							>
								<span className="text-muted-foreground">
									{item.title}
								</span>
								<MoveRight className="w-4 h-4 stroke-1" />
							</Link>
						))}
					</div>
				)}
			</div>
		</header>
	);
};
