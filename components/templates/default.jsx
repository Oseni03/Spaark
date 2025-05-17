"use client";

import React from "react";
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
import { ChevronRightIcon, HomeIcon, NotebookIcon, Globe } from "lucide-react";
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
import { GithubLogo } from "@phosphor-icons/react";
import { getSocialLink, getSocialIcon } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/Spinner";
import { defaultMain } from "@/schema/sections";

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
	technologies,
	metadata = defaultMain.metadata,
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
					<Avatar
						className={`border size-12 m-auto bg-muted-[${metadata.theme.background}] dark:bg-foreground`}
					>
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
							<div
								className={`text-xs sm:text-sm tabular-nums text-[${metadata.theme.text}] text-right`}
							>
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
					{technologies && (
						<span className="inline-flex gap-x-1">
							{technologies.map((tech, index) => (
								<Badge
									variant="secondary"
									className="align-middle text-xs"
									key={index}
								>
									{tech}
								</Badge>
							))}
						</span>
					)}
				</div>
			</Card>
		</Link>
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

export default function DefaultTemplate({
	basics = defaultMain.basics,
	experiences = defaultMain.experiences,
	educations = defaultMain.educations,
	skills = defaultMain.skills,
	projects = defaultMain.projects,
	hackathons = defaultMain.hackathons,
	certifications = defaultMain.certifications,
	socials = defaultMain.socials,
	metadata = defaultMain.metadata,
	blogEnabled = defaultMain.blogEnabled,
}) {
	const navbar = [
		{ href: "/", icon: HomeIcon, label: "Home" },
		{
			href: "/blog",
			icon: NotebookIcon,
			label: "Blog",
			requiresBlog: true,
		},
	].filter((item) => !item.requiresBlog || blogEnabled);

	const { formData, errors, isSubmitting, handleChange, handleSubmit } =
		useUserContactForm();
	return (
		<main className="max-w-3xl mx-auto py-12 sm:py-24 px-6">
			<div className="flex flex-col min-h-[100dvh] space-y-10 overflow-auto scrollbar-hide">
				<section id="hero">
					<div className="mx-auto w-full max-w-3xl space-y-8">
						<div className="gap-2 flex justify-between">
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
							{basics.picture && (
								<BlurFade delay={BLUR_FADE_DELAY}>
									<Avatar className="size-20 md:size-28 border">
										<AvatarImage
											alt={basics?.name}
											src={basics.picture}
										/>
										<AvatarFallback>
											{getInitials(basics?.name || "")}
										</AvatarFallback>
									</Avatar>
								</BlurFade>
							)}
						</div>
					</div>
				</section>

				{/* Update section spacing and text sizes */}
				<section id="about">
					<BlurFade delay={BLUR_FADE_DELAY * 3}>
						<h2 className="text-lg md:text-xl font-bold">About</h2>
					</BlurFade>
					<BlurFade
						delay={BLUR_FADE_DELAY * 4}
						className={`prose max-w-full text-pretty font-sans text-sm text-[${metadata.theme.text}] dark:prose-invert`}
					>
						{HTMLReactParser(basics?.about || "")}
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
										technologies={work.technologies}
										metadata={metadata}
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
										metadata={metadata}
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
										<Badge key={skill.id}>
											{skill.name}
										</Badge>
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
										<div
											className={`inline-block rounded-lg bg-foreground text-[${metadata.theme.background}] px-3 py-1 text-xs md:text-sm`}
										>
											My Projects
										</div>
										<h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl">
											Check out my latest work
										</h2>
										<p
											className={`text-sm text-[${metadata.theme.text}] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
										>
											I&apos;ve worked on a variety of
											projects, from simple websites to
											complex web applications. Here are a
											few of my favorites.
										</p>
									</div>
								</div>
							</BlurFade>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
								{projects.map(
									(
										{
											name: title,
											description,
											date: dates,
											technologies: tags,
											website,
											source,
											image,
											video,
											type,
										},
										id
									) => (
										<BlurFade
											key={id}
											delay={
												BLUR_FADE_DELAY * 12 + id * 0.05
											}
										>
											<Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
												<div
													className={cn(
														"block cursor-pointer",
														className
													)}
												>
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
													className={cn(
														image || video
															? "px-2"
															: "px-4",
														"py-2 md:py-4"
													)}
												>
													<div className="space-y-1">
														<p className="font-sans text-xs">
															{type}
														</p>
														<CardTitle className="text-sm md:text-base">
															{title}
														</CardTitle>
														<time className="font-sans text-xs">
															{dates}
														</time>
														<div className="text-sm">
															{HTMLReactParser(
																description ||
																	""
															)}
														</div>
													</div>
												</CardHeader>
												<CardContent className="mt-auto flex flex-col px-5">
													{tags &&
														tags.length > 0 && (
															<div className="mt-2 flex flex-wrap gap-1">
																{tags?.map(
																	(
																		tag,
																		index
																	) => (
																		<Badge
																			className="px-1 py-0 text-[10px]"
																			variant="secondary"
																			key={
																				index
																			}
																		>
																			{
																				tag
																			}
																		</Badge>
																	)
																)}
															</div>
														)}
												</CardContent>
												<CardFooter className="px-2 pb-2">
													<div className="flex flex-row flex-wrap items-start gap-1">
														{website && (
															<Link
																href={website}
																target="_blank"
															>
																<Badge className="flex gap-2 px-2 py-1 text-[10px]">
																	<Globe className="w-4 h-4" />
																	Demo
																</Badge>
															</Link>
														)}
														{source && (
															<Link
																href={source}
																target="_blank"
															>
																<Badge className="flex gap-2 px-2 py-1 text-[10px]">
																	<GithubLogo className="w-4 h-4" />
																	Source
																</Badge>
															</Link>
														)}
													</div>
												</CardFooter>
											</Card>
										</BlurFade>
									)
								)}
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
										<div
											className={`inline-block rounded-lg bg-foreground text-[${metadata.theme.background}] px-3 py-1 text-sm`}
										>
											Certifications
										</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
											I value learning
										</h2>
										<p
											className={`text-[${metadata.theme.text}] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
										>
											Explore the professional
											certifications I have earned
											throughout my career, showcasing my
											commitment to continuous learning
											and expertise in various fields.
											These certifications reflect my
											proficiency in key technologies,
											methodologies, and industry best
											practices, helping me stay at the
											forefront of innovation and ensuring
											that I deliver high-quality
											solutions.
										</p>
									</div>
								</div>
							</BlurFade>
							<BlurFade delay={BLUR_FADE_DELAY * 14}>
								<ul className="mb-4 ml-4 divide-y divide-dashed border-l">
									{certifications.map(
										(
											{
												name,
												issuer,
												summary,
												location,
												date,
												url,
											},
											id
										) => (
											<BlurFade
												key={id}
												delay={
													BLUR_FADE_DELAY * 15 +
													id * 0.05
												}
											>
												<li className="relative ml-10 py-4 flex flex-col gap-4">
													<div className="flex flex-1 flex-col gap-1">
														{date && (
															<time
																className={`text-xs text-[${metadata.theme.text}]`}
																dateTime={date}
															>
																{date}
															</time>
														)}

														<h2 className="text-base font-semibold leading-snug text-foreground">
															{name}
														</h2>

														{issuer && (
															<p
																className={`text-sm text-[${metadata.theme.text}]`}
															>
																Issued by{" "}
																{issuer}
															</p>
														)}

														{summary && (
															<p
																className={`prose dark:prose-invert text-sm text-[${metadata.theme.text}]`}
															>
																{HTMLReactParser(
																	summary ||
																		""
																)}
															</p>
														)}
													</div>

													{url && (
														<Link
															href={url}
															target="_blank"
															rel="noopener noreferrer"
														>
															<Badge className="inline-flex items-center gap-2 px-2 py-1 text-sm">
																<Globe className="h-4 w-4" />
																Source
															</Badge>
														</Link>
													)}
												</li>
											</BlurFade>
										)
									)}
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
										<div
											className={`inline-block rounded-lg bg-foreground text-[${metadata.theme.background}] px-3 py-1 text-sm`}
										>
											Hackathons
										</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
											I like building things
										</h2>
										<p
											className={`text-[${metadata.theme.text}] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
										>
											During my time in university, I
											attended {hackathons.length}+
											hackathons. People from around the
											country would come together and
											build incredible things in 2-3 days.
											It was eye-opening to see the
											endless possibilities brought to
											life by a group of motivated and
											passionate individuals.
										</p>
									</div>
								</div>
							</BlurFade>
							<BlurFade delay={BLUR_FADE_DELAY * 14}>
								<ul className="mb-4 ml-4 divide-y divide-dashed border-l">
									{hackathons.map(
										(
											{
												name: title,
												description,
												location,
												date: dates,
												logo: image,
												links,
												technologies,
											},
											id
										) => (
											<BlurFade
												key={id}
												delay={
													BLUR_FADE_DELAY * 15 +
													id * 0.05
												}
											>
												<li className="relative ml-10 py-4">
													<div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
														<Avatar className="border size-12 m-auto">
															<AvatarImage
																src={image}
																alt={title}
																className="object-contain"
															/>
															<AvatarFallback>
																{title[0]}
															</AvatarFallback>
														</Avatar>
													</div>

													<div className="flex flex-1 flex-col gap-1">
														{/* Date Display */}
														{dates && (
															<time
																className={`text-xs text-[${metadata.theme.text}]`}
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
															<p
																className={`text-sm text-[${metadata.theme.text}]`}
															>
																{location}
															</p>
														)}

														{technologies && (
															<span className="inline-flex gap-x-1">
																{technologies.map(
																	(
																		tech,
																		index
																	) => (
																		<Badge
																			variant="secondary"
																			className="align-middle text-xs"
																			key={
																				index
																			}
																		>
																			{
																				tech
																			}
																		</Badge>
																	)
																)}
															</span>
														)}

														{/* Description */}
														{description && (
															<p
																className={`prose dark:prose-invert text-sm text-[${metadata.theme.text}]`}
															>
																{HTMLReactParser(
																	description ||
																		""
																)}
															</p>
														)}

														{/* Links */}
														{links &&
															links.length >
																0 && (
																<div className="flex flex-row flex-wrap items-start gap-1 mt-2">
																	{links.map(
																		(
																			link,
																			idx
																		) => (
																			<Link
																				href={
																					link?.url
																				}
																				key={
																					idx
																				}
																				target="_blank"
																			>
																				<Badge className="flex gap-2 px-2 py-1 text-[10px]">
																					<Image
																						src={`https://cdn.simpleicons.org/${link.icon}`}
																						alt={
																							link.label
																						}
																						width={
																							20
																						}
																						height={
																							20
																						}
																						className="w-5 h-5"
																					/>
																					{
																						link.label
																					}
																				</Badge>
																			</Link>
																		)
																	)}
																</div>
															)}
													</div>
												</li>
											</BlurFade>
										)
									)}
								</ul>
							</BlurFade>
						</div>
					</section>
				)}

				<section id="contact">
					<BlurFade delay={BLUR_FADE_DELAY * 16}>
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									Get In Touch
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Let&rsquo;s Work Together
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									Have a project in mind? Let&rsquo;s discuss
									how I can help bring your ideas to life.
								</p>
							</div>

							<div className="max-w-3xl mx-auto">
								<Card className="bg-card border-border overflow-hidden">
									<div className="grid grid-cols-1 md:grid-cols-2">
										<div
											className={`p-8 bg-[${metadata.theme.primary}]/5`}
										>
											<h3 className="text-xl font-bold mb-6">
												Contact Information
											</h3>
											<div className="space-y-6">
												{basics.email && (
													<div>
														<p
															className={`text-[${metadata.theme.text}] mb-1 text-sm`}
														>
															Email
														</p>
														<p className="font-medium">
															{basics.email}
														</p>
													</div>
												)}
												{basics.location && (
													<div>
														<p
															className={`text-[${metadata.theme.text}] mb-1 text-sm`}
														>
															Location
														</p>
														<p className="font-medium">
															{basics.location}
														</p>
													</div>
												)}

												{socials.length > 0 && (
													<div>
														<p
															className={`text-[${metadata.theme.text}] mb-1 text-sm`}
														>
															Social Media
														</p>
														<div className="flex gap-3 mt-2">
															{socials.map(
																(
																	social,
																	index
																) => (
																	<Link
																		key={
																			index
																		}
																		href={getSocialLink(
																			social
																		)}
																		className={cn(
																			buttonVariants(
																				{
																					variant:
																						"ghost",
																					size: "icon",
																				}
																			),
																			`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
																		)}
																	>
																		{getSocialIcon(
																			social
																		)}
																		<span className="sr-only">
																			{social.network.toUpperCase()}
																		</span>
																	</Link>
																)
															)}
															{basics.email && (
																<Link
																	href={`mailto:${basics.email}`}
																	className={cn(
																		buttonVariants(
																			{
																				variant:
																					"ghost",
																				size: "icon",
																			}
																		),
																		`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
																	)}
																>
																	<Mail className="h-4 w-4" />
																	<span className="sr-only">
																		Email
																	</span>
																</Link>
															)}
														</div>
													</div>
												)}
											</div>
										</div>

										<div className="p-8">
											<h3 className="text-xl font-bold mb-6">
												Send a Message
											</h3>
											<form
												onSubmit={handleSubmit}
												className="space-y-4"
											>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<label
															htmlFor="name"
															className="text-sm font-medium"
														>
															Name
														</label>
														<input
															id="name"
															type="text"
															name="full_name"
															value={
																formData.full_name
															}
															onChange={
																handleChange
															}
															className={cn(
																errors.full_name
																	? "border-red-500"
																	: "",
																`w-full p-2 bg-[${metadata.theme.background}] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[${metadata.theme.primary}] focus:border-transparent`
															)}
														/>
														{errors.full_name && (
															<p className="text-red-500">
																{
																	errors.full_name
																}
															</p>
														)}
													</div>
													<div className="space-y-2">
														<label
															htmlFor="email"
															className="text-sm font-medium"
														>
															Email
														</label>
														<input
															id="email"
															type="email"
															name="email"
															value={
																formData.email
															}
															onChange={
																handleChange
															}
															className={cn(
																errors.email
																	? "border-red-500"
																	: "",
																`w-full p-2 bg-[${metadata.theme.background}] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[${metadata.theme.primary}] focus:border-transparent`
															)}
														/>
														{errors.email && (
															<p className="text-red-500">
																{errors.email}
															</p>
														)}
													</div>
												</div>
												<div className="space-y-2">
													<label
														htmlFor="subject"
														className="text-sm font-medium"
													>
														Subject
													</label>
													<input
														id="subject"
														type="text"
														name="subject"
														value={formData.subject}
														onChange={handleChange}
														className={cn(
															errors.subject
																? "border-red-500"
																: "",
															`w-full p-2 bg-[${metadata.theme.background}] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[${metadata.theme.primary}] focus:border-transparent`
														)}
													/>
													{errors.subject && (
														<p className="text-red-500">
															{errors.subject}
														</p>
													)}
												</div>
												<div className="space-y-2">
													<label
														htmlFor="message"
														className="text-sm font-medium"
													>
														Message
													</label>
													<textarea
														id="message"
														name="message"
														value={formData.message}
														onChange={handleChange}
														rows={4}
														className={cn(
															errors.message
																? "border-red-500"
																: "",
															`w-full p-2 bg-[${metadata.theme.background}] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[${metadata.theme.primary}] focus:border-transparent`
														)}
													></textarea>
													{errors.message && (
														<p className="text-red-500">
															{errors.message}
														</p>
													)}
												</div>
												<Button
													type="submit"
													className="w-full"
													disabled={isSubmitting}
												>
													{isSubmitting && (
														<Spinner />
													)}
													{isSubmitting
														? "Sending..."
														: "Send Message"}
												</Button>
											</form>
										</div>
									</div>
								</Card>
							</div>
						</div>
					</BlurFade>
				</section>
			</div>
			<section id="navbar">
				<div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-6 flex flex-col origin-bottom h-full max-h-14">
					<div
						className={`fixed bottom-0 inset-x-0 h-16 w-full bg-[${metadata.theme.background}] to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-[${metadata.theme.background}]`}
					></div>
					<Dock
						className={`z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-[${metadata.theme.background}] [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] `}
					>
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
						{Object.entries(socials)
							.filter(([_, socials]) => socials.visible)
							.map(([network, socials]) => (
								<DockIcon key={network}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={getSocialLink(socials)}
												target="_blank"
												className={cn(
													buttonVariants({
														variant: "ghost",
														size: "icon",
													}),
													"size-12"
												)}
											>
												{getSocialIcon(socials)}
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>
												{socials.network
													.charAt(0)
													.toLocaleUpperCase() +
													socials.network.slice(1)}
											</p>
										</TooltipContent>
									</Tooltip>
								</DockIcon>
							))}
						<Separator
							orientation="vertical"
							className="h-full py-2"
						/>
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
			</section>
		</main>
	);
}
