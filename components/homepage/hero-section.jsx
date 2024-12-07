import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn UI library

const HeroSection = () => {
	return (
		<section className="relative py-16 md:py-48">
			<div className="container mx-auto px-6 md:px-14 lg:px-48 text-center">
				{/* Date and Location */}
				<div className="inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium">
					March 24 - 26, 2024 | San Diego, CA
				</div>

				{/* Headline */}
				<h1 className="text-4xl md:text-6xl font-bold mb-4">
					Join the #1 conference for developers.
				</h1>

				{/* Subtext */}
				<p className="text-lg md:text-xl mb-8">
					Join us virtually for Block, the #1 conference for
					professional software developers. Improving efficiency,
					security, and developer productivity.
				</p>

				{/* Buttons */}
				<div className="flex justify-center gap-4">
					<Button>Register Now</Button>
					<Button variant="outline">Add to Calendar</Button>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
