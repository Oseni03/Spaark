import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useOrganizationContext } from "@/context/OrganizationContext";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconBook,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const links = [
	{
		label: "Portfolios",
		href: "/dashboard/portfolios",
		icon: (
			<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
	{
		label: "Blogs",
		href: "/dashboard/blogs",
		icon: (
			<IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
	{
		label: "Settings",
		href: "#",
		icon: (
			<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
];

export function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					<div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
						<OrganizationSwitcher
							appearance={{
								elements: {
									rootBox: "w-full",
									organizationSwitcherTrigger: cn(
										"w-full flex justify-between items-center",
										"p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
									),
								},
							}}
						/>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton
										asChild
										className={cn(
											pathname === item.href &&
												"bg-neutral-100 dark:bg-neutral-800 text-primary"
										)}
									>
										<Link href={item.href}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
					<UserButton
						appearance={{
							elements: {
								rootBox: "w-full",
								userButtonTrigger: cn(
									"w-full flex justify-between items-center",
									"p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
								),
							},
						}}
					/>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
