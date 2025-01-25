import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import HTMLReactParser from "html-react-parser";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ContactForm } from "@/app/contact-us/components/contact-form";
import { useUserContactForm } from "@/hooks/use-user-contact-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;
import { Dock, DockIcon } from "@/components/magicui/dock";
import ModeToggle from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { useUser } from "@clerk/nextjs";
import {
	GithubLogo,
	LinkedinLogo,
	XLogo,
	YoutubeLogo,
} from "@phosphor-icons/react";
import { Pen } from "lucide-react";

function Navbar({ profile }) {
	const { isSignedIn } = useUser();
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-6 flex flex-col origin-bottom h-full max-h-14">
			<div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
			<Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
				{siteConfig.navbar.map((item) => (
					<DockIcon key={item.href}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={item.href}
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"size-12"
									)}
								>
									<item.icon className="size-4" />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>{item.label}</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				))}
				{isSignedIn && (
					<DockIcon key={"builder"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={"/builder"}
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"size-12"
									)}
								>
									<Pen size={5} />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Builder</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				)}

				<Separator orientation="vertical" className="h-full" />
				{Object.entries(profile)
					.filter(([_, social]) => social.visible)
					.map(([network, social]) => (
						<DockIcon key={network}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={social.url}
										target="_blank"
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											"size-12"
										)}
									>
										{social.network === "github" && (
											<GithubLogo size={4} />
										)}
										{social.network === "linkedin" && (
											<LinkedinLogo size={4} />
										)}
										{social.network === "x" && (
											<XLogo size={4} />
										)}
										{social.network === "youtube" && (
											<YoutubeLogo size={4} />
										)}
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{social.network
											.charAt(0)
											.toLocaleUpperCase() +
											social.network.slice(1)}
									</p>
								</TooltipContent>
							</Tooltip>
						</DockIcon>
					))}
				<Separator orientation="vertical" className="h-full py-2" />
				<DockIcon>
					<Tooltip>
						<TooltipTrigger asChild>
							<ModeToggle />
						</TooltipTrigger>
						<TooltipContent>
							<p>Theme</p>
						</TooltipContent>
					</Tooltip>
				</DockIcon>
			</Dock>
			<Link
				href={process.env.NEXT_PUBLIC_APP_URL}
				target="_blank" // Corrected here
				rel="noopener noreferrer" // Added for security best practices
				className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
			>
				<Image
					src="/spaark.svg"
					alt="Spaark Logo"
					width={32}
					height={32}
				/>
				Made with Spaark
			</Link>
		</div>
	);
}

const ResumeCard = ({
	logoUrl,
	altText,
	title,
	subtitle,
	href,
	badges,
	period,
	description,
}) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	const handleClick = (e) => {
		if (description) {
			e.preventDefault();
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<Link
			href={href || "#"}
			className="block cursor-pointer"
			onClick={handleClick}
		>
			<Card className="flex border border-hidden shadow-none">
				<div className="flex-none">
					<Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
						<AvatarImage
							src={logoUrl}
							alt={altText}
							className="object-contain"
						/>
						<AvatarFallback>{altText[0]}</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex-grow ml-4 items-center flex-col group">
					<CardHeader className="p-0">
						<div className="flex items-center justify-between gap-x-2 text-base">
							<h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
								{title}
								{badges && (
									<span className="inline-flex gap-x-1">
										{badges.map((badge, index) => (
											<Badge
												variant="secondary"
												className="align-middle text-xs"
												key={index}
											>
												{badge}
											</Badge>
										))}
									</span>
								)}
								<ChevronRightIcon
									className={cn(
										"size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
										isExpanded ? "rotate-90" : "rotate-0"
									)}
								/>
							</h3>
							<div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
								{period}
							</div>
						</div>
						{subtitle && (
							<div className="font-sans text-xs">{subtitle}</div>
						)}
					</CardHeader>
					{description && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{
								opacity: isExpanded ? 1 : 0,

								height: isExpanded ? "auto" : 0,
							}}
							transition={{
								duration: 0.7,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="mt-2 text-xs sm:text-sm"
						>
							{description}
						</motion.div>
					)}
				</div>
			</Card>
		</Link>
	);
};

function ProjectCard({
	title,
	href,
	description,
	dates,
	tags,
	link,
	image,
	video,
	links,
	className,
}) {
	return (
		<Card
			className={
				"flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
			}
		>
			<Link
				href={href || "#"}
				className={cn("block cursor-pointer", className)}
			>
				{video && (
					<video
						src={video}
						autoPlay
						loop
						muted
						playsInline
						className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
					/>
				)}
				{image && (
					<img
						src={image}
						alt={title}
						width="500"
						height="300"
						className="h-40 w-full overflow-hidden object-cover object-top"
					/>
				)}
			</Link>
			<CardHeader className={image || video ? "px-2" : "px-4"}>
				<div className="space-y-1">
					<CardTitle className="mt-1 text-base">{title}</CardTitle>
					<time className="font-sans text-xs">{dates}</time>
					<div className="hidden font-sans text-xs underline print:visible">
						{link
							?.replace("https://", "")
							.replace("www.", "")
							.replace("/", "")}
					</div>
					{description}
				</div>
			</CardHeader>
			<CardContent className="mt-auto flex flex-col px-5">
				{tags && tags.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{tags?.map((tag) => (
							<Badge
								className="px-1 py-0 text-[10px]"
								variant="secondary"
								key={tag}
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
			<CardFooter className="px-2 pb-2">
				{links && links.length > 0 && (
					<div className="flex flex-row flex-wrap items-start gap-1">
						{links?.map((link, idx) => (
							<Link href={link?.url} key={idx} target="_blank">
								<Badge
									key={idx}
									className="flex gap-2 px-2 py-1 text-[10px]"
								>
									<img
										src={`https://cdn.simpleicons.org/${link.icon}`}
										alt={link.label}
										className="w-5 h-5"
									/>
									{link.label}
								</Badge>
							</Link>
						))}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}

function HackathonCard({ title, description, dates, location, image, links }) {
	return (
		<li className="relative ml-10 py-4">
			<div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
				<Avatar className="border size-12 m-auto">
					<AvatarImage
						src={image}
						alt={title}
						className="object-contain"
					/>
					<AvatarFallback>{title[0]}</AvatarFallback>
				</Avatar>
			</div>
			<div className="flex flex-1 flex-col justify-start gap-1">
				{dates && (
					<time className="text-xs text-muted-foreground">
						{dates}
					</time>
				)}
				<h2 className="font-semibold leading-none">{title}</h2>
				{location && (
					<p className="text-sm text-muted-foreground">{location}</p>
				)}
				{description && (
					<span className="prose dark:prose-invert text-sm text-muted-foreground">
						{description}
					</span>
				)}
			</div>
			{links && links.length > 0 && (
				<div className="mt-2 flex flex-row flex-wrap items-start gap-2">
					{links?.map((link, idx) => (
						<Link href={link.url} key={idx}>
							<Badge
								key={idx}
								title={link.label}
								className="flex gap-2"
							>
								<img
									src={`https://cdn.simpleicons.org/${link.icon}`}
									alt={link.label}
									className="w-5 h-5"
								/>
								{link.label}
							</Badge>
						</Link>
					))}
				</div>
			)}
		</li>
	);
}

function ContactCard() {
	const { formData, errors, isSubmitting, handleChange, handleSubmit } =
		useUserContactForm();

	return (
		<CardContainer className="inter-var">
			<CardBody className="bg-black text-white relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gray-50 dark:text-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
				<CardItem translateZ="50" className="text-xl font-bold">
					Send a message
				</CardItem>
				<CardItem
					as="p"
					translateZ="60"
					className="text-sm max-w-sm mt-2"
				>
					Will get back to you in no time
				</CardItem>
				<div className="text-start">
					<CardItem translateZ="60" className="w-full mt-4">
						<ContactForm
							formData={formData}
							errors={errors}
							isSubmitting={isSubmitting}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
						/>
					</CardItem>
				</div>
			</CardBody>
		</CardContainer>
	);
}

function CertificationCard({ name, issuer, date, summary, url }) {
	return (
		<li className="relative ml-10 py-4 flex flex-col gap-4">
			<div className="flex flex-1 flex-col gap-1">
				{/* Date Display */}
				{date && (
					<time
						className="text-xs text-muted-foreground"
						dateTime={new Date(date).toISOString()}
					>
						{date}
					</time>
				)}

				{/* Certification Name */}
				<h2 className="text-base font-semibold leading-snug text-foreground">
					{name}
				</h2>

				{/* Issuer */}
				{issuer && (
					<p className="text-sm text-muted-foreground">
						Issued by {issuer}
					</p>
				)}

				{/* Summary */}
				{summary && (
					<p className="prose dark:prose-invert text-sm text-muted-foreground">
						{summary}
					</p>
				)}
			</div>

			{/* Source Link */}
			{url && (
				<Link href={url} target="_blank" rel="noopener noreferrer">
					<Badge className="inline-flex items-center gap-2 px-2 py-1 text-sm">
						<Globe className="h-4 w-4" />
						Source
					</Badge>
				</Link>
			)}
		</li>
	);
}

export default function DefaultTemplate({
	basics = {},
	experiences = [],
	educations = [],
	skills = [],
	projects = [],
	hackathons = [],
	certifications = [],
	profiles = [],
}) {
	return (
		<main className="flex flex-col min-h-[100dvh] space-y-10">
			<section id="hero">
				<div className="mx-auto w-full max-w-2xl space-y-8">
					<div className="gap-2 flex justify-between">
						<div className="flex-col flex flex-1 space-y-1.5">
							<BlurFadeText
								delay={BLUR_FADE_DELAY}
								className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
								yOffset={8}
								text={`Hi, I'm ${basics?.name?.split(" ")[0] || "there"} 👋`}
							/>
							<BlurFadeText
								className="max-w-[600px] md:text-xl"
								delay={BLUR_FADE_DELAY}
								text={
									basics?.summary
										? HTMLReactParser(basics.summary)
										: ""
								}
							/>
						</div>
						<BlurFade delay={BLUR_FADE_DELAY}>
							<Avatar className="size-28 border">
								<AvatarImage
									alt={basics?.name}
									src={basics?.picture}
								/>
								<AvatarFallback>
									{getInitials(basics?.name || "")}
								</AvatarFallback>
							</Avatar>
						</BlurFade>
					</div>
				</div>
			</section>
			<section id="about">
				<BlurFade delay={BLUR_FADE_DELAY * 3}>
					<h2 className="text-xl font-bold">About</h2>
				</BlurFade>
				<BlurFade delay={BLUR_FADE_DELAY * 4}>
					{HTMLReactParser(basics?.about)}
				</BlurFade>
			</section>
			{experiences.length > 0 && (
				<section id="work">
					<div className="flex min-h-0 flex-col gap-y-3">
						<BlurFade delay={BLUR_FADE_DELAY * 5}>
							<h2 className="text-xl font-bold">
								Work Experience
							</h2>
						</BlurFade>
						{experiences.map((work, id) => (
							<BlurFade
								key={work.company}
								delay={BLUR_FADE_DELAY * 6 + id * 0.05}
							>
								<ResumeCard
									key={work.company}
									logoUrl={work.picture}
									altText={work.company}
									title={work.company}
									subtitle={work.position}
									href={work.url}
									badges={work.badges}
									period={work.date}
									description={HTMLReactParser(work.summary)}
								/>
							</BlurFade>
						))}
					</div>
				</section>
			)}
			{educations.length > 0 && (
				<section id="education">
					<div className="flex min-h-0 flex-col gap-y-3">
						<BlurFade delay={BLUR_FADE_DELAY * 7}>
							<h2 className="text-xl font-bold">Education</h2>
						</BlurFade>
						{educations.map((edu, id) => (
							<BlurFade
								key={edu.institution}
								delay={BLUR_FADE_DELAY * 8 + id * 0.05}
							>
								<ResumeCard
									key={edu.institution}
									href={edu.url}
									logoUrl={edu.logo}
									altText={edu.institution}
									title={edu.institution}
									subtitle={edu.studyType}
									period={edu.date}
								/>
							</BlurFade>
						))}
					</div>
				</section>
			)}
			{skills.length > 0 && (
				<section id="skills">
					<div className="flex min-h-0 flex-col gap-y-3">
						<BlurFade delay={BLUR_FADE_DELAY * 9}>
							<h2 className="text-xl font-bold">Skills</h2>
						</BlurFade>
						<div className="flex flex-wrap gap-1">
							{skills.map((skill, id) => (
								<BlurFade
									key={skill.id}
									delay={BLUR_FADE_DELAY * 10 + id * 0.05}
								>
									<Badge key={skill.id}>{skill.name}</Badge>
								</BlurFade>
							))}
						</div>
					</div>
				</section>
			)}
			{projects.length > 0 && (
				<section id="projects">
					<div className="space-y-12 w-full py-12">
						<BlurFade delay={BLUR_FADE_DELAY * 11}>
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
										My Projects
									</div>
									<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
										Check out my latest work
									</h2>
									<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										I&apos;ve worked on a variety of
										projects, from simple websites to
										complex web applications. Here are a few
										of my favorites.
									</p>
								</div>
							</div>
						</BlurFade>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
							{projects.map((project, id) => (
								<BlurFade
									key={project.id}
									delay={BLUR_FADE_DELAY * 12 + id * 0.05}
								>
									<ProjectCard
										href={project.url}
										key={project.name}
										title={project.name}
										description={HTMLReactParser(
											project.description
										)}
										dates={project.date}
										tags={project.technologies}
										image={project.image}
										links={project.links}
									/>
								</BlurFade>
							))}
						</div>
					</div>
				</section>
			)}
			{certifications.length > 0 && (
				<section id="certifications">
					<div className="space-y-12 w-full py-12">
						<BlurFade delay={BLUR_FADE_DELAY * 13}>
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
										Certifications
									</div>
									<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
										I value learning
									</h2>
									<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Explore the professional certifications
										I have earned throughout my career,
										showcasing my commitment to continuous
										learning and expertise in various
										fields. These certifications reflect my
										proficiency in key technologies,
										methodologies, and industry best
										practices, helping me stay at the
										forefront of innovation and ensuring
										that I deliver high-quality solutions.
									</p>
								</div>
							</div>
						</BlurFade>
						<BlurFade delay={BLUR_FADE_DELAY * 14}>
							<ul className="mb-4 ml-4 divide-y divide-dashed border-l">
								{certifications.map((project, id) => (
									<BlurFade
										key={project.id}
										delay={BLUR_FADE_DELAY * 15 + id * 0.05}
									>
										<CertificationCard
											name={project.name}
											issuer={project.issuer}
											summary={HTMLReactParser(
												project.summary
											)}
											location={project.location}
											date={project.date}
											url={project.url}
										/>
									</BlurFade>
								))}
							</ul>
						</BlurFade>
					</div>
				</section>
			)}
			{hackathons.length > 0 && (
				<section id="hackathons">
					<div className="space-y-12 w-full py-12">
						<BlurFade delay={BLUR_FADE_DELAY * 13}>
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
										Hackathons
									</div>
									<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
										I like building things
									</h2>
									<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										During my time in university, I attended{" "}
										{hackathons.length}+ hackathons. People
										from around the country would come
										together and build incredible things in
										2-3 days. It was eye-opening to see the
										endless possibilities brought to life by
										a group of motivated and passionate
										individuals.
									</p>
								</div>
							</div>
						</BlurFade>
						<BlurFade delay={BLUR_FADE_DELAY * 14}>
							<ul className="mb-4 ml-4 divide-y divide-dashed border-l">
								{hackathons.map((project, id) => (
									<BlurFade
										key={project.id}
										delay={BLUR_FADE_DELAY * 15 + id * 0.05}
									>
										<HackathonCard
											title={project.name}
											description={HTMLReactParser(
												project.description
											)}
											location={project.location}
											dates={project.date}
											image={project.logo || null}
											links={project.links}
										/>
									</BlurFade>
								))}
							</ul>
						</BlurFade>
					</div>
				</section>
			)}
			<section id="contact">
				<div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
					<BlurFade delay={BLUR_FADE_DELAY * 16}>
						<div className="space-y-3">
							<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
								Contact
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Got a project in mind?
							</h2>
							<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Don&rsquo;t be shy – send a message and slide
								into my digital inbox! I promise I&rsquo;m way
								more responsive than my houseplants.
							</p>
							<ContactCard />
						</div>
					</BlurFade>
				</div>
			</section>
			<Navbar profile={profiles} />
		</main>
	);
}
