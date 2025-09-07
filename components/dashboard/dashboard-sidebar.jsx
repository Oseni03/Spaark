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
import { TableProperties, Settings2, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/dashboard/layout";
import { UserDropdown } from "../user-dropdown";
import { useSession } from "@/lib/auth-client";

const links = [
	{
		label: "Portfolios",
		href: "/dashboard/portfolios",
		icon: (
			<TableProperties className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
	{
		label: "Blogs",
		href: "/dashboard/blogs",
		icon: (
			<Book className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
	{
		label: "Settings",
		href: "/dashboard/settings",
		icon: (
			<Settings2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		),
	},
];

export function DashboardSidebar() {
	const pathname = usePathname();
	const {
		data: { user },
	} = useSession();

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					<div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
						<Logo />
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
					<div className="flex gap-2">
						<UserDropdown />
						<p>{user.name}</p>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
