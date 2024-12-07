import { Cloud, FileAudio } from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";
// import MediaImage from "@/public/illustartions/media.png";
// import ChannelImage from "@/public/illustartions/channels.png";
// import CloudImage from "@/public/illustartions/cloud.png";

export const siteConfig = {
	name: "YouAudio",
	heroIntro: "Stay Updated with the Latest YouTube Content – In Audio",
	description:
		"Effortlessly track your favorite YouTube channels and get new video content in audio format. Subscribe, listen, and enjoy – all on your terms.",
	keywords: ["component library", "react", "vue", "reactjs"],
	features: [
		{
			name: "Instant Audio Extraction from YouTube Videos.",
			description:
				"Easily convert any YouTube video into audio with a simple URL input. Enjoy high-quality audio files optimized for your needs, whether it's for offline listening or content creation.",
			icon: FileAudio,
			// image: MediaImage,
			id: "instant-audio",
		},
		{
			name: "Automatic Channel Monitoring.",
			description:
				"Subscribe to your favorite YouTube channels and get notified whenever new videos are uploaded. Instantly access audio versions without manually converting each video.",
			icon: FaBusinessTime,
			className: "lg:flex-row-reverse",
			// image: ChannelImage,
			id: "channel-monitoring",
		},
		{
			name: "Seamless Cloud Integration.",
			description:
				"Your extracted audio files are securely uploaded to the cloud, giving you fast access and reliable storage. Share or download audio files effortlessly from anywhere.",
			icon: Cloud,
			// image: CloudImage,
			id: "cloud-integration",
		},
	],
};
