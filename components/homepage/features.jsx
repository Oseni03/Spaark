import { siteConfig } from "@/config/site";

export const Features = () => (
	<section id="features" className="container mx-auto px-6 py-10 py-md-16">
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
			{siteConfig.features.map((feature) => (
				<div
					key={feature.id}
					className="flex flex-col items-center text-center max-w-sm p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
				>
					{feature.icon && (
						<feature.icon className="w-12 h-12 mb-4 text-primary" />
					)}
					<h3 className="text-xl font-semibold mb-2">
						{feature.name}
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						{feature.description}
					</p>
				</div>
			))}
		</div>
	</section>
);
