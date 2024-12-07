import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

function FormWrapper({ title, description, children }) {
	return (
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 px-5">
			<div className="absolute left-4 top-4 md:left-8 md:top-8">
				<Link
					className="flex items-center text-lg font-medium"
					href="/"
				>
					<span className="font-semibold text-xl">
						{siteConfig.name}
					</span>
				</Link>
			</div>
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<span className="font-semibold text-xl">
						{siteConfig.name}
					</span>
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">{siteConfig.description}</p>
						<footer className="text-sm">{siteConfig.name}</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto my-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							{title}
						</h1>
						<p className="text-sm text-muted-foreground">
							{description}
						</p>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}

export default FormWrapper;
