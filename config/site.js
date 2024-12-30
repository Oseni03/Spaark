import { FileCode, Share2, Brush } from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";
import { HomeIcon, NotebookIcon } from "lucide-react";
// import MediaImage from "@/public/illustartions/media.png";
// import ChannelImage from "@/public/illustartions/channels.png";
// import CloudImage from "@/public/illustartions/cloud.png";

export const siteConfig = {
	name: "Spaark",
	heroIntro: "Create your professional portfolio in minutes",
	description:
		"Build stunning developer portfolio effortlessly with our intuitive portfolio builder. Showcase your projects, connect with potential clients, and personalize your site—all without writing a single line of code. Elevate your online presence today!",
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
	],
	author: "github.com/Oseni03",
	github: "https://github.com/Oseni03/Spaark",
	icon: "/icon.png",
	logo: "/logo.png",
	url: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	twitterHandle: "@Oseni03",
	features: [
		{
			name: "Showcase Projects",
			description:
				"Description: Display your work with customizable, professional templates designed for developers.",
			icon: FileCode,
			// image: MediaImage,
			id: "instant-audio",
		},
		{
			name: "Connect Easily",
			description:
				"Description: Link your GitHub, LinkedIn, and more, with a built-in contact form for easy communication.",
			icon: Share2,
			className: "lg:flex-row-reverse",
			// image: ChannelImage,
			id: "channel-monitoring",
		},
		{
			name: "Simple Customization",
			description:
				"Description: Personalize colors, fonts, and layouts effortlessly, or unlock advanced customization options.",
			icon: Brush,
			// image: CloudImage,
			id: "cloud-integration",
		},
	],
	navbar: [
		{ href: "/", icon: HomeIcon, label: "Home" },
		// { href: "/blog", icon: NotebookIcon, label: "Blog" },
	],
};
