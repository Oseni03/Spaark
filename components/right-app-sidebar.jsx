import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Copyright } from "./copyright";
import { TemplateSection } from "./sections/template";
import { SectionIcon } from "./section-icon";
import ModeToggle from "./mode-toggle";
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

			<div className="hidden basis-12 flex-col items-center justify-between bg-secondary-accent/30 py-4 sm:flex">
				<div />
				<div className="flex flex-col items-center justify-center gap-y-2">
					<SectionIcon
						id="template"
						name="Template"
						onClick={() => {
							document
								.querySelector("#template")
								?.scrollIntoView({ behavior: "smooth" });
						}}
					/>
				</div>
				<ModeToggle />
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
