import { MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => (
	<div className="w-full">
		<div className="container mx-auto">
			<div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
				<div>
					<Button variant="secondary" size="sm" className="gap-4">
						Read our launch article{" "}
						<MoveRight className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex gap-4 flex-col">
					<h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
						{siteConfig.heroIntro}
					</h1>
					<p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
						{siteConfig.description}
					</p>
				</div>
				<div className="flex flex-row gap-3">
					<Link href={"/sign-up"}>
						<Button size="lg" className="gap-4">
							Sign up here <MoveRight className="w-4 h-4" />
						</Button>
					</Link>
					<Link href={siteConfig.github}>
						<Button size="lg" className="gap-4" variant="outline">
							Star on GitHub{" "}
							<Image
								src="/github.svg"
								alt="GitHub"
								width={16}
								height={16}
							/>
						</Button>
					</Link>
				</div>
			</div>
		</div>
	</div>
);
