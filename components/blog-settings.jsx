"use client";

import { useDispatch, useSelector } from "react-redux";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { checkBlogEnableAuth } from "@/middleware/subscription-auth";

export function BlogSettings() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const { user } = useAuth();

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const toggleBlogFeature = async () => {
		if (!portfolio) return;

		if (portfolio.blogEnabled) {
			const blogAuth = await checkBlogEnableAuth();

			if (!blogAuth.allowed) {
				toast.error(
					blogAuth.reason ||
						"Blog feature not available in current plan"
				);
				return;
			}

			dispatch(
				updatePortfolioInDatabase({
					id: portfolio.id,
					data: { blogEnabled: !portfolio.blogEnabled },
				})
			);
		}
	};

	return (
		<section id="blog-settings" className="flex flex-col gap-y-4">
			<header>
				<h2 className="text-xl font-semibold">Blog settings</h2>
				<p className="text-sm text-muted-foreground">
					Configure a blog for your portfolio
				</p>
			</header>

			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Label>Enable Blog</Label>
					<p className="text-sm text-muted-foreground">
						Show blog section on your portfolio
					</p>
				</div>
				<Switch
					checked={portfolio?.blogEnabled || false}
					onCheckedChange={toggleBlogFeature}
				/>
			</div>
		</section>
	);
}
