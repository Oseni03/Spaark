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
					<Link href="https://medium.com/@Oseni03/unveiling-the-ultimate-developer-portfolio-builder-powered-by-magicui-spaark-743f6e6ef7b4">
						<Button variant="secondary" size="sm" className="gap-4">
							Read our launch article{" "}
							<MoveRight className="w-4 h-4" />
						</Button>
					</Link>
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
				<a
					href="https://www.producthunt.com/products/spaark-2?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-spaark&#0045;2"
					target="_blank"
					style={{
						position: "fixed",
						bottom: "40px", // Adjusted from 20px to 40px
						right: "20px",
						zIndex: 1000,
					}}
				>
					<img
						src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=859386&theme=light"
						alt="Spaark - Create&#0032;your&#0032;professional&#0032;portfolio&#0032;in&#0032;minutes | Product Hunt"
						style={{ width: "250px", height: "54px" }}
						width="250"
						height="54"
					/>
				</a>
			</div>
		</div>
	</div>
);
