import { AccordionComponent } from "@/components/homepage/accordion-component";
import { HeroSection } from "@/components/homepage/hero-section";
import Newsletter from "@/components/homepage/newsletter";
import Pricing from "@/components/homepage/pricing";
import { Features } from "@/components/homepage/features";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Home() {
	return (
		<PageWrapper>
			{/* Hero Section */}
			<div className="flex w-full">
				<HeroSection />
			</div>

			{/* Features Section */}
			<div className="flex w-full py-20" id="features">
				<Features />
			</div>

			{/* Pricing Section */}
			<div
				id="pricing"
				className="flex w-full py-20 bg-gradient-to-b from-background to-muted/20"
			>
				<Pricing />
			</div>

			{/* FAQ Section */}
			<div className="flex w-full py-20">
				<AccordionComponent />
			</div>

			{/* Newsletter Section - Commented out for now */}
			{/* <div
				id="newsletter"
				className="flex w-full py-20 bg-gradient-to-b from-muted/20 to-background"
			>
				<Newsletter />
			</div> */}
		</PageWrapper>
	);
}
