import localFont from "next/font/local";
import CustomProvider from "@/redux/provider";
import { ThemeProvider, CSPostHogProvider } from "./providers";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { SanityLive } from "@/sanity/lib/live";
import Script from "next/script";
import { AuthProvider } from "../context/auth-context";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	openGraph: {
		type: "website",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		images: [
			{
				url: `/og.png`,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`/og.png`],
		creator: siteConfig.twitterHandle,
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<Script
						strategy="afterInteractive"
						src="https://www.googletagmanager.com/gtag/js?id=G-QX32SHB6DT"
					/>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-QX32SHB6DT');
						`}
					</Script>
				</head>
				<CSPostHogProvider>
					<body
						className={cn(
							"min-h-screen font-sans antialiased",
							fontSans.variable
						)}
					>
						<CustomProvider>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								<TooltipProvider delayDuration={0}>
									<Toaster />
									<SanityLive />
									{children}
								</TooltipProvider>
							</ThemeProvider>
						</CustomProvider>
					</body>
				</CSPostHogProvider>
			</html>
		</AuthProvider>
	);
}
