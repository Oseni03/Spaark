import { FileCode, Share2, Brush } from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";
import { HomeIcon, NotebookIcon } from "lucide-react";
// import MediaImage from "@/public/illustartions/media.png";
// import ChannelImage from "@/public/illustartions/channels.png";
// import CloudImage from "@/public/illustartions/cloud.png";

export const siteConfig = {
	name: "Spaark",
	heroIntro: "Design Your Professional Narrative",
	description:
		"More than a portfolio—a powerful platform to visualize your achievements, highlight your skills, and unlock new possibilities.",
	keywords: ["component library", "react", "vue", "reactjs"],
	features: [
		{
			name: "Showcase Your Work Effortlessly",
			description:
				"Easily display your projects, skills, and achievements with beautiful, customizable templates designed specifically for developers. Highlight your best work in a clean, professional layout that makes a lasting impression.",
			icon: FileCode,
			// image: MediaImage,
			id: "instant-audio",
		},
		{
			name: "Connect & Engage",
			description:
				"Integrate your portfolio with GitHub, LinkedIn, and other social platforms to showcase your online presence. Include a built-in contact form to make it easy for potential clients or employers to get in touch.",
			icon: Share2,
			className: "lg:flex-row-reverse",
			// image: ChannelImage,
			id: "channel-monitoring",
		},
		{
			name: "Customization Made Simple",
			description:
				"No coding required! Personalize your portfolio with an intuitive editor that lets you adjust colors, fonts, and images. Upgrade to advanced customization options to make your portfolio truly unique and stand out in the crowd.",
			icon: Brush,
			// image: CloudImage,
			id: "cloud-integration",
		},
	],
	navbar: [
		{ href: "/", icon: HomeIcon, label: "Home" },
		{ href: "/blog", icon: NotebookIcon, label: "Blog" },
	],
};
