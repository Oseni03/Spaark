import { siteConfig } from "@/config/site";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="py-3 my-4">
			<ul className="flex justify-center border-b pb-3 mb-3">
				<li className="mx-2">
					<Link
						href="/"
						className="text-gray-500 hover:text-gray-700"
					>
						Home
					</Link>
				</li>
				<li className="mx-2">
					<Link
						href="/#features"
						className="text-gray-500 hover:text-gray-700"
					>
						Features
					</Link>
				</li>
				<li className="mx-2">
					<Link
						href="/#pricing"
						className="text-gray-500 hover:text-gray-700"
					>
						Pricing
					</Link>
				</li>
				<li className="mx-2">
					<Link
						href="/privacy-policy"
						className="text-gray-500 hover:text-gray-700"
					>
						Privacy
					</Link>
				</li>
				<li className="mx-2">
					<Link
						href="/terms"
						className="text-gray-500 hover:text-gray-700"
					>
						Terms
					</Link>
				</li>
			</ul>
			<p className="text-center text-gray-500">
				© {new Date().getFullYear()} {siteConfig.name}
			</p>
		</footer>
	);
};

export default Footer;
