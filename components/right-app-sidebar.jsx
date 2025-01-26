import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Copyright } from "./copyright";
import { TemplateSection } from "./sections/template";
import { useMediaQuery } from "@/hooks/use-media-query";

export const RightSidebar = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const Content = (
		<>
			<div className="grid gap-y-6 p-6 @container/right">
				<TemplateSection />
				<Separator />
				<Copyright className="text-center" />
			</div>
		</>
	);

	if (isDesktop) {
		return (
			<div className="flex h-screen bg-secondary-accent/30">
				<div className="flex-1 overflow-y-auto">{Content}</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-secondary-accent/30">
			<ScrollArea className="flex-1">{Content}</ScrollArea>
		</div>
	);
};
