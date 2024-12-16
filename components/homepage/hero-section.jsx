import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn UI library
import { siteConfig } from "@/config/site";
import Link from "next/link";

const HeroSection = () => {
	return (
		<section className="relative py-10">
			<div className="container relative py-12">
				<div className="flex justify-center text-center py-14 lg:py-32">
					<div className="w-full max-w-4xl">
						<div className="flex flex-col space-y-6">
							<div className="flex flex-col space-y-4">
								<h1 className="text-4xl lg:text-5xl font-bold mb-0">
									{siteConfig.heroIntro}
								</h1>
								<p className="text-lg lg:px-20 mb-0">
									{siteConfig.description}
								</p>
							</div>

							<div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
								<Link href="/sign-up">
									<Button className="px-6 py-3 rounded-full">
										Get Free Portfolio
									</Button>
								</Link>

								<Link
									href="#!"
									className="flex items-center space-x-2 group"
								>
									<span>Star on GitHub</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										fill="currentColor"
										viewBox="0 0 16 16"
										className="transition-transform group-hover:translate-x-1"
									>
										<path
											fillRule="evenodd"
											d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
