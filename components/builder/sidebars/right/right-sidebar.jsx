import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateSection } from "./template";
import { SettingsTab } from "./settings-tab";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PaintBrush, Sliders } from "@phosphor-icons/react";

export const RightSidebar = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const Content = (
		<>
			<div className="p-6 @container/right">
				<Tabs defaultValue="template" className="h-full space-y-6">
					<TabsList className="w-full grid grid-cols-2">
						<TabsTrigger
							value="template"
							className="flex items-center gap-2"
						>
							<PaintBrush className="h-4 w-4" />
							Template
						</TabsTrigger>
						<TabsTrigger
							value="settings"
							className="flex items-center gap-2"
						>
							<Sliders className="h-4 w-4" />
							Settings
						</TabsTrigger>
					</TabsList>
					<TabsContent value="template" className="mt-0 border-0">
						<TemplateSection />
					</TabsContent>
					<TabsContent value="settings" className="mt-0 border-0">
						<SettingsTab />
					</TabsContent>
				</Tabs>
				{/* <div className="mt-6">
					<Copyright className="text-center" />
				</div> */}
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
			<ScrollArea className="flex-1 scrollbar-hide">{Content}</ScrollArea>
		</div>
	);
};
