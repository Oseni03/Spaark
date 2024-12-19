import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export const Features = () => (
	<div className="w-full py-20 lg:py-40">
		<div className="container mx-auto">
			<div className="grid border rounded-lg container py-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
				<div className="flex gap-10 flex-col">
					<div className="flex gap-4 flex-col">
						<div>
							<Badge variant="outline">Platform</Badge>
						</div>
						<div className="flex gap-2 flex-col">
							<h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
								Display Your Best Work
							</h2>
							<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
								Impress clients with beautifully crafted
								templates tailored to showcase your expertise
								and achievements.
							</p>
						</div>
					</div>
					<div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
						{siteConfig.features.map((item, index) => (
							<div
								className="flex flex-row gap-6 items-start"
								key={index}
							>
								<Check className="w-4 h-4 mt-2 text-primary" />
								<div className="flex flex-col gap-1">
									<p>{item.name}</p>
									<p className="text-muted-foreground text-sm">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-muted rounded-md aspect-square"></div>
			</div>
		</div>
	</div>
);
