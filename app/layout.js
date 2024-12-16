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
	title: siteConfig.name,
	description: siteConfig.description,
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
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
				</body>
			</html>
		</ClerkProvider>
	);
}
