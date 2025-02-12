import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";

export function AccordionComponent() {
	return (
		<div className="flex flex-col w-[70%] lg:w-[50%]">
			<h2
				className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}
			>
				Frequently Asked Questions (FAQs)
			</h2>
			<Accordion type="single" collapsible className="w-full mt-2">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						<span className="font-medium">
							How does Spaark work?
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<p>
							Spaark simplifies portfolio creation into three easy
							steps: select a template, fill in your details, and
							choose whether to enable a blog. Once done, your
							portfolio goes live instantly.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>
						<span className="font-medium">
							What are the subscription options?
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<p>
							We offer flexible plans starting at $3/week for
							individual accounts. Choose between weekly, monthly
							($10), or yearly ($96) billing. Team accounts start
							at $25/month with additional collaboration features.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>
						<span className="font-medium">
							Can I use a custom domain?
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<p>
							Yes! All subscription plans include custom domain
							support. You can easily connect your own domain to
							your Spaark portfolio.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger>
						<span className="font-medium">
							What&apos;s included in the team plan?
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<p>
							Team plans include all individual features plus team
							collaboration, shared templates, team analytics,
							priority support, and custom branding. You can
							manage up to 3 portfolios under one team account.
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-5">
					<AccordionTrigger>
						<span className="font-medium">
							Can I switch templates later?
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<p>
							Yes, you can switch between available templates at
							any time without losing your content. All your
							information will automatically adapt to the new
							template layout.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
