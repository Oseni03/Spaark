"use client";
import Link from "next/link";
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import ModeToggle from "../mode-toggle";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function NavBar() {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<>
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className={`fixed top-0 left-0 right-0 z-10`}
			>
				<div className="flex min-w-full fixed justify-between items-center p-2 border-b z-20 dark:bg-black dark:bg-opacity-50 bg-white">
					<div className="flex items-center space-x-2 ">
						<div className="flex lg:flex-1">
							<Link
								href="/"
								className="pl-2 flex items-center"
								aria-label="Home"
							>
								<span className="font-semibold text-xl">
									{siteConfig.name}
								</span>
							</Link>
						</div>
						<CollapsibleTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="w-4 h-4 md:hidden"
								aria-label={isOpen ? "Close menu" : "Open menu"}
							>
								<GiHamburgerMenu />
							</Button>
						</CollapsibleTrigger>
					</div>

					<NavigationMenu className="hidden md:block">
						<NavigationMenuList>
							<NavigationMenuItem className="ml-5">
								<NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">
									Features
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
										{siteConfig.features.map(
											(component, index) => (
												<ListItem
													key={index}
													title={component.name}
													href={`/#${component.id}`}
												>
													{component.description}
												</ListItem>
											)
										)}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/#pricing" legacyBehavior passHref>
									<Button variant="ghost">Pricing</Button>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link
									href="/contact-us"
									legacyBehavior
									passHref
								>
									<Button variant="ghost">Contact us</Button>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link
									href="/#newsletter"
									legacyBehavior
									passHref
								>
									<Button variant="ghost">Newsletter</Button>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<div className="flex items-center gap-2 ">
						<ModeToggle />
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<SignInButton />
						</SignedOut>
					</div>
				</div>

				<CollapsibleContent
					className={cn(
						"fixed inset-y-0 left-0 w-64 bg-background border-r shadow-lg transition-transform duration-300 ease-in-out transform",
						isOpen ? "translate-x-0" : "-translate-x-full"
					)}
				>
					<div className="flex flex-col p-4 space-y-4 mt-16">
						<Link href="/">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => setIsOpen(false)}
							>
								Home
							</Button>
						</Link>
						<Link href="/dashboard">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => setIsOpen(false)}
							>
								Dashboard
							</Button>
						</Link>
						<Link href="/#pricing">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => setIsOpen(false)}
							>
								Pricing
							</Button>
						</Link>
						<Link href="/contact-us">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => setIsOpen(false)}
							>
								Contact us
							</Button>
						</Link>
						<Link href="/#newsletter">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => setIsOpen(false)}
							>
								Newsletter
							</Button>
						</Link>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
}

const ListItem = React.forwardRef(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						ref={ref}
						className={cn(
							"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className
						)}
						{...props}
					>
						<div className="text-sm font-medium leading-none">
							{title}
						</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{children}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		);
	}
);
ListItem.displayName = "ListItem";
