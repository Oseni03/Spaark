import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import CustomProvider from "@/redux/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";

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
				url: `${siteConfig.url}/api/og`,
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
		images: [`${siteConfig.url}/api/og`],
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
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<Script
					id="gtm-script"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5KHDF45N');`,
					}}
				/>
				<body
					className={cn(
						"min-h-screen bg-background font-sans antialiased",
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
								{children}
							</TooltipProvider>
						</ThemeProvider>
					</CustomProvider>
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-5KHDF45N"
							height="0"
							width="0"
							style="display:none;visibility:hidden"
						></iframe>
					</noscript>
				</body>
			</html>
		</ClerkProvider>
	);
}
