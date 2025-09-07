"use client";

import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { canEnableBlog } from "@/lib/subscription-utils";
import { useSession } from "@/lib/auth-client";

export function BlogSettings() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const { data, isPending } = useSession();
	const user = !isPending ? data?.user : null;

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const toggleBlogFeature = async () => {
		if (!portfolio) return;

		if (portfolio.blogEnabled) {
			if (!canEnableBlog(user.id)) {
				toast.error("Blog feature not available in current plan");
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
