"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import HTMLReactParser from "html-react-parser";
import { getInitials, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	ChevronRightIcon,
	HomeIcon,
	NotebookIcon,
	Globe,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ContactForm } from "@/app/contact-us/components/contact-form";
import { useUserContactForm } from "@/hooks/use-user-contact-form";
import { Dock, DockIcon } from "@/components/magicui/dock";
import ModeToggle from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	GithubLogo,
	LinkedinLogo,
	XLogo,
	YoutubeLogo,
} from "@phosphor-icons/react";
import { BuildWithButton } from "../build-with-button";

const BLUR_FADE_DELAY = 0.04;

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

const ProjectCard = ({
	title,
	description,
	dates,
	tags,
	website,
	source,
	image,
	video,
	className,
}) => {
	return (
		<Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
			<div className={cn("block cursor-pointer", className)}>
				{video && (
					<video
						src={video}
						autoPlay
						loop
						muted
						playsInline
						className="pointer-events-none mx-auto h-32 md:h-40 w-full object-cover object-top"
					/>
				)}
				{image && (
					<Image
						src={image}
						alt={title}
						width={500}
						height={300}
						className="h-32 md:h-40 w-full overflow-hidden object-cover object-top"
					/>
				)}
			</div>
			<CardHeader
				className={cn(image || video ? "px-2" : "px-4", "py-2 md:py-4")}
			>
				<div className="space-y-1">
					<CardTitle className="text-sm md:text-base">
						{title}
					</CardTitle>
					<time className="font-sans text-xs">{dates}</time>
					<div className="text-sm">{description}</div>
				</div>
			</CardHeader>
			<CardContent className="mt-auto flex flex-col px-5">
				{tags && tags.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{tags?.map((tag, index) => (
							<Badge
								className="px-1 py-0 text-[10px]"
								variant="secondary"
								key={index}
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
			<CardFooter className="px-2 pb-2">
				<div className="flex flex-row flex-wrap items-start gap-1">
					{website && (
						<Link href={website} target="_blank">
							<Badge className="flex gap-2 px-2 py-1 text-[10px]">
								<Globe className="w-4 h-4" />
								Demo
							</Badge>
						</Link>
					)}
					{source && (
						<Link href={source} target="_blank">
							<Badge className="flex gap-2 px-2 py-1 text-[10px]">
								<GithubLogo className="w-4 h-4" />
								Source
							</Badge>
						</Link>
					)}
				</div>
			</CardFooter>
		</Card>
	);
};

const HackathonCard = ({
	title,
	description,
	dates,
	location,
	image,
	links,
}) => {
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

			<div className="flex flex-1 flex-col gap-1">
				{/* Date Display */}
				{dates && (
					<time
						className="text-xs text-muted-foreground"
						dateTime={dates}
					>
						{dates}
					</time>
				)}

				{/* Title */}
				<h2 className="text-base font-semibold leading-snug text-foreground">
					{title}
				</h2>

				{/* Location */}
				{location && (
					<p className="text-sm text-muted-foreground">{location}</p>
				)}

				{/* Description */}
				{description && (
					<p className="prose dark:prose-invert text-sm text-muted-foreground">
						{description}
					</p>
				)}

				{/* Links */}
				{links && links.length > 0 && (
					<div className="flex flex-row flex-wrap items-start gap-1 mt-2">
						{links.map((link, idx) => (
							<Link href={link?.url} key={idx} target="_blank">
								<Badge className="flex gap-2 px-2 py-1 text-[10px]">
									<Image
										src={`https://cdn.simpleicons.org/${link.icon}`}
										alt={link.label}
										width={20}
										height={20}
										className="w-5 h-5"
									/>
									{link.label}
								</Badge>
							</Link>
						))}
					</div>
				)}
			</div>
		</li>
	);
};

const CertificationCard = ({ name, issuer, date, summary, url }) => {
	return (
		<li className="relative ml-10 py-4 flex flex-col gap-4">
			<div className="flex flex-1 flex-col gap-1">
				{date && (
					<time
						className="text-xs text-muted-foreground"
						dateTime={date}
					>
						{date}
					</time>
				)}

				<h2 className="text-base font-semibold leading-snug text-foreground">
					{name}
				</h2>

				{issuer && (
					<p className="text-sm text-muted-foreground">
						Issued by {issuer}
					</p>
				)}

				{summary && (
					<p className="prose dark:prose-invert text-sm text-muted-foreground">
						{summary}
					</p>
				)}
			</div>

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
};

const ContactCard = () => {
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
							revert={true}
						/>
					</CardItem>
				</div>
			</CardBody>
		</CardContainer>
	);
};

const Navbar = ({ profile, blogEnabled }) => {
	const navbar = [
		{ href: "/", icon: HomeIcon, label: "Home" },
		{
			href: "/blog",
			icon: NotebookIcon,
			label: "Blog",
			requiresBlog: true,
		},
	].filter((item) => !item.requiresBlog || blogEnabled);

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-6 flex flex-col origin-bottom h-full max-h-14">
			<div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
			<Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
				{navbar.map((item, index) => (
					<DockIcon key={index}>
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
		</div>
	);
};

export const TestimonialCarousel = ({ testimonials = [], className = "" }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	const autoPlayInterval = 5000;
	const showRating = true;

	useEffect(() => {
		let intervalId;

		if (isAutoPlaying && !isPaused && testimonials.length > 1) {
			intervalId = setInterval(() => {
				setCurrentIndex((prevIndex) =>
					prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
				);
			}, autoPlayInterval);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isAutoPlaying, isPaused, testimonials.length, autoPlayInterval]);

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
		);
		setIsAutoPlaying(false);
	};

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
		);
		setIsAutoPlaying(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === "ArrowLeft") goToPrevious();
		if (e.key === "ArrowRight") goToNext();
	};

	const renderStars = (rating) => {
		return Array(rating).fill("★").join("");
	};

	return (
		<div
			className={cn(`relative w-full max-w-2xl mx-auto`, className)}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onKeyDown={handleKeyDown}
			role="region"
			aria-label="Testimonials carousel"
			tabIndex={0}
		>
			<motion.div
				className="relative overflow-hidden rounded-xl bg-card shadow-lg dark:bg-card border"
				initial={false}
			>
				<motion.div
					className="flex"
					animate={{ x: `-${currentIndex * 100}%` }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							className="w-full flex-shrink-0 p-6 flex items-center justify-center" // Added flex, items-center, and justify-center
							style={{ width: "100%" }}
							initial={{ opacity: 0 }}
							animate={{
								opacity: currentIndex === index ? 1 : 0.5,
							}}
							transition={{ duration: 0.3 }}
						>
							<div className="flex flex-col items-center text-center space-y-4">
								{testimonial.avatar && (
									<Avatar className="size-20 border">
										<AvatarImage
											src={testimonial.avatar}
											alt={testimonial.name}
											className="object-cover"
										/>
										<AvatarFallback>
											{testimonial.name[0]}
										</AvatarFallback>
									</Avatar>
								)}
								<blockquote className="space-y-2">
									<p className="text-muted-foreground text-sm md:text-base">
										{testimonial.message}
									</p>
									{showRating && testimonial.rating && (
										<div className="text-yellow-400 dark:text-yellow-300 text-sm">
											{renderStars(testimonial.rating)}
										</div>
									)}
									<footer className="space-y-1">
										<div className="font-medium text-foreground">
											{testimonial.name}
										</div>
										<div className="text-xs text-muted-foreground">
											{testimonial.role}
											{testimonial.company && (
												<>, {testimonial.company}</>
											)}
										</div>
									</footer>
								</blockquote>
							</div>
						</motion.div>
					))}
				</motion.div>

				{testimonials.length > 1 && (
					<>
						<button
							onClick={goToPrevious}
							className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							aria-label="Previous testimonial"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>

						<button
							onClick={goToNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							aria-label="Next testimonial"
						>
							<ChevronRight className="h-5 w-5" />
						</button>

						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => {
										setCurrentIndex(index);
										setIsAutoPlaying(false);
									}}
									className={cn(
										"h-2 w-2 rounded-full transition-colors",
										currentIndex === index
											? "bg-primary"
											: "bg-muted hover:bg-muted-foreground"
									)}
									aria-label={`Go to slide ${index + 1}`}
									aria-current={currentIndex === index}
								/>
							))}
						</div>
					</>
				)}
			</motion.div>
		</div>
	);
};

// Add this after other section definitions and before the DefaultTemplate component
const TeamMemberCard = ({ name, role, avatar }) => {
	return (
		<Card className="text-center border hover:shadow-lg transition-all duration-300 ease-out">
			<CardContent className="p-6 py-10 flex flex-col items-center">
				<Avatar className="size-24 border mb-4">
					<AvatarImage
						src={avatar}
						alt={name}
						className="object-cover"
					/>
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>
				<h3 className="font-semibold mb-1">{name}</h3>
				<p className="text-sm text-muted-foreground">{role}</p>
			</CardContent>
		</Card>
	);
};

export default function DefaultTemplate({
	basics,
	experiences,
	educations,
	skills,
	projects,
	hackathons,
	certifications,
	profiles = [],
	testimonials = [],
	teams = [], // Add this new prop
	blogEnabled = false,
}) {
	return (
		<>
			<BuildWithButton />
			<main className="flex flex-col min-h-[100dvh] overflow-auto scrollbar-hide">
				<div className="container mx-auto px-4 md:px-6 space-y-8 md:space-y-10 max-w-4xl">
					<section id="hero" className="pt-6 md:pt-10">
						<div className="space-y-6 md:space-y-8">
							<div className="gap-4 flex justify-between">
								<div className="flex-col flex flex-1 space-y-1.5">
									<BlurFadeText
										delay={BLUR_FADE_DELAY}
										className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
										yOffset={8}
										text={`Hi, I'm ${basics?.name?.split(" ")[0]} 👋`}
									/>
									<BlurFadeText
										className="text-sm md:text-xl"
										delay={BLUR_FADE_DELAY}
										text={HTMLReactParser(
											basics?.summary || ""
										)}
									/>
								</div>
								<BlurFade delay={BLUR_FADE_DELAY}>
									<Avatar className="size-20 md:size-28 border">
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

					{/* Update section spacing and text sizes */}
					<section id="about" className="space-y-3 md:space-y-4">
						<BlurFade delay={BLUR_FADE_DELAY * 3}>
							<h2 className="text-lg md:text-xl font-bold">
								About
							</h2>
						</BlurFade>
						<BlurFade
							delay={BLUR_FADE_DELAY * 4}
							className="text-sm md:text-base"
						>
							{HTMLReactParser(basics?.about || "")}
						</BlurFade>
					</section>

					{experiences.length > 0 && (
						<section id="work" className="space-y-4">
							<BlurFade delay={BLUR_FADE_DELAY * 5}>
								<h2 className="text-xl font-bold">
									Work Experience
								</h2>
							</BlurFade>
							<div className="flex min-h-0 flex-col gap-y-3">
								{experiences.map((work, id) => (
									<BlurFade
										key={work.id}
										delay={BLUR_FADE_DELAY * 6 + id * 0.05}
									>
										<ResumeCard
											key={work.id}
											logoUrl={work.picture}
											altText={work.company}
											title={work.company}
											subtitle={work.position}
											href={work.url}
											badges={work.badges}
											period={work.date}
											description={HTMLReactParser(
												work.summary || ""
											)}
										/>
									</BlurFade>
								))}
							</div>
						</section>
					)}

					{educations.length > 0 && (
						<section id="education" className="space-y-4">
							<BlurFade delay={BLUR_FADE_DELAY * 7}>
								<h2 className="text-xl font-bold">Education</h2>
							</BlurFade>
							<div className="flex min-h-0 flex-col gap-y-3">
								{educations.map((edu, id) => (
									<BlurFade
										key={edu.id}
										delay={BLUR_FADE_DELAY * 8 + id * 0.05}
									>
										<ResumeCard
											key={edu.id}
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
						<section id="skills" className="space-y-4">
							<BlurFade delay={BLUR_FADE_DELAY * 9}>
								<h2 className="text-xl font-bold">Skills</h2>
							</BlurFade>
							<div className="flex flex-wrap gap-1">
								{skills.map((skill, id) => (
									<BlurFade
										key={skill.id}
										delay={BLUR_FADE_DELAY * 10 + id * 0.05}
									>
										<Badge key={skill.id}>
											{skill.name}
										</Badge>
									</BlurFade>
								))}
							</div>
						</section>
					)}

					{projects.length > 0 && (
						<section
							id="projects"
							className="space-y-6 md:space-y-8 py-8 md:py-12"
						>
							<BlurFade delay={BLUR_FADE_DELAY * 11}>
								<div className="flex flex-col items-center justify-center space-y-4 text-center">
									<div className="space-y-2">
										<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-xs md:text-sm">
											My Projects
										</div>
										<h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl">
											Check out my latest work
										</h2>
										<p className="text-sm md:text-base text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
											I&apos;ve worked on a variety of
											projects, from simple websites to
											complex web applications. Here are a
											few of my favorites.
										</p>
									</div>
								</div>
							</BlurFade>
							<div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2">
								{projects.map((project, id) => (
									<BlurFade
										key={project.id}
										delay={BLUR_FADE_DELAY * 12 + id * 0.05}
									>
										<ProjectCard
											title={project.name}
											description={HTMLReactParser(
												project.description || ""
											)}
											dates={project.date}
											tags={project.technologies}
											website={project.website}
											source={project.source}
											image={project.image}
											video={project.video}
										/>
									</BlurFade>
								))}
							</div>
						</section>
					)}

					{testimonials.length > 0 && (
						<section
							id="testimonials"
							className="space-y-6 md:space-y-8 py-8 md:py-12"
						>
							<BlurFade delay={BLUR_FADE_DELAY * 11}>
								<div className="flex flex-col items-center justify-center space-y-4 text-center">
									<div className="space-y-2">
										<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
											Testimonials
										</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
											What people say
										</h2>
										<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[800px] mx-auto">
											I&rsquo;ve had the pleasure of
											working with amazing people
											throughout my career. Here&rsquo;s
											what some of them have to say about
											our collaboration.
										</p>
									</div>
								</div>
							</BlurFade>
							<BlurFade delay={BLUR_FADE_DELAY * 12}>
								<TestimonialCarousel
									testimonials={testimonials}
								/>
							</BlurFade>
						</section>
					)}

					{certifications.length > 0 && (
						<section
							id="certifications"
							className="space-y-6 md:space-y-8 py-8 md:py-12"
						>
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
												Explore the professional
												certifications I have earned
												throughout my career, showcasing
												my commitment to continuous
												learning and expertise in
												various fields. These
												certifications reflect my
												proficiency in key technologies,
												methodologies, and industry best
												practices, helping me stay at
												the forefront of innovation and
												ensuring that I deliver
												high-quality solutions.
											</p>
										</div>
									</div>
								</BlurFade>
								<BlurFade delay={BLUR_FADE_DELAY * 14}>
									<ul className="mb-4 ml-4 divide-y divide-dashed border-l">
										{certifications.map((project, id) => (
											<BlurFade
												key={project.id}
												delay={
													BLUR_FADE_DELAY * 15 +
													id * 0.05
												}
											>
												<CertificationCard
													name={project.name}
													issuer={project.issuer}
													summary={HTMLReactParser(
														project.summary || ""
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
						<section
							id="hackathons"
							className="space-y-6 md:space-y-8 py-8 md:py-12"
						>
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
												During my time in university, I
												attended {hackathons.length}+
												hackathons. People from around
												the country would come together
												and build incredible things in
												2-3 days. It was eye-opening to
												see the endless possibilities
												brought to life by a group of
												motivated and passionate
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
												delay={
													BLUR_FADE_DELAY * 15 +
													id * 0.05
												}
											>
												<HackathonCard
													title={project.name}
													description={HTMLReactParser(
														project.description ||
															""
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

					{teams.length > 0 && (
						<section
							id="team"
							className="space-y-6 md:space-y-8 py-8 md:py-12"
						>
							<div className="space-y-12 w-full py-12">
								<BlurFade delay={BLUR_FADE_DELAY * 13}>
									<div className="flex flex-col items-center justify-center space-y-4 text-center">
										<div className="space-y-2">
											<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
												Our Team
											</div>
											<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
												Save your time and money by
												choosing our team
											</h2>
											<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[800px] mx-auto">
												Meet our talented team of
												professionals dedicated to
												bringing your vision to life
											</p>
										</div>
									</div>
								</BlurFade>
								<BlurFade delay={BLUR_FADE_DELAY * 14}>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{teams.map((member, id) => (
											<BlurFade
												key={member.id}
												delay={
													BLUR_FADE_DELAY * 15 +
													id * 0.05
												}
											>
												<TeamMemberCard
													name={member.name}
													role={member.role}
													avatar={member.avatar}
												/>
											</BlurFade>
										))}
									</div>
								</BlurFade>
							</div>
						</section>
					)}

					<section
						id="contact"
						className="space-y-6 md:space-y-8 pb-20"
					>
						<BlurFade delay={BLUR_FADE_DELAY * 16}>
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-xs md:text-sm">
										Contact
									</div>
									<h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl">
										Got a project in mind?
									</h2>
									<p className="text-sm mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Don&rsquo;t be shy – send a message and
										slide into my digital inbox! I promise
										I&rsquo;m way more responsive than my
										houseplants.
									</p>
								</div>
								<ContactCard />
							</div>
						</BlurFade>
					</section>
				</div>
			</main>
			<Navbar profile={profiles} blogEnabled={blogEnabled} />
		</>
	);
}
