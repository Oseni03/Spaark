import { FileCode, Code, Globe, Book } from "lucide-react";
// import MediaImage from "@/public/illustartions/media.png";
// import ChannelImage from "@/public/illustartions/channels.png";
// import CloudImage from "@/public/illustartions/cloud.png";

export const siteConfig = {
	name: "Spaark",
	heroIntro: "Build your developer portfolio in minutes",
	description:
		"Showcase your code, projects, and technical skills with our developer-focused templates. Deploy your portfolio with custom domains and integrated tech blog.",
	keywords: [
		"portfolio builder",
		"developer portfolio",
		"developer portfolio generator",
		"portfolio website",
		"portfolio maker",
		"portfolio design",
		"portfolio management",
		"developer showcase",
		"portfolio template",
		"personal website",
		"wix alternatives",
		"wix pricing",
		"webflow alternatives",
		"webflow pricing",
		"squarespace alternatives",
		"squarespace pricing",
		"wordpress alternatives",
		"wordpress pricing",
		"portfolio",
		"professional portfolio",
		"resume builder",
	],
	author: "github.com/Oseni03",
	github: "https://github.com/Oseni03/Spaark",
	icon: "/icon.png",
	logo: "/logo.png",
	url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	twitterHandle: "@Oseni03",
	features: [
		{
			name: "Stunning Portfolio Templates",
			description:
				"Launch your professional tech portfolio in minutes with our mobile-responsive, SEO-optimized templates designed specifically for developers and tech professionals.",
			icon: FileCode,
			id: "templates",
			plans: ["free", "basic", "pro"],
		},
		{
			name: "Professional Domain Setup",
			description:
				"Stand out with a custom domain that matches your personal brand. Easy setup with full SSL security and fast global CDN included.",
			icon: Globe,
			id: "domain",
			plans: ["basic", "pro"],
		},
		{
			name: "Built-in Tech Blog",
			description:
				"Boost your personal brand with an integrated technical blog. Share your expertise, attract recruiters, and establish thought leadership in your field.",
			icon: Book,
			id: "blog",
			plans: ["basic", "pro"],
		},
		{
			name: "Developer-Focused Features",
			description:
				"Showcase your GitHub projects, tech stack, and coding achievements with dedicated sections that highlight your technical expertise.",
			icon: Code,
			id: "tech-features",
			plans: ["basic", "pro"],
		},
	],
	templates: [
		{
			id: "default",
			name: "Default",
			preview: "/templates/default.png",
		},
		{
			id: "violetvista",
			name: "Violet Vista",
			preview: "/templates/violetvista.png",
		},
		{
			id: "neomint",
			name: "Neomint",
			preview: "/templates/noemint.png",
		},
	],
};
