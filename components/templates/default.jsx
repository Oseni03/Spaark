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
import { ChevronRightIcon, Globe } from "lucide-react";
import { useUserContactForm } from "@/hooks/use-user-contact-form";
import { buttonVariants } from "@/components/ui/button";
import { GithubLogo } from "@phosphor-icons/react";
import { getSocialLink, getSocialIcon } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/Spinner";
import { defaultMain } from "@/schema/sections";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
						className={`border size-12 m-auto bg-muted-background dark:bg-foreground`}
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
								className={`text-xs sm:text-sm tabular-nums text-muted-foreground text-right`}
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
						<span className="inline-flex flex-wrap gap-1">
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

export default function DefaultTemplate({
	basics = defaultMain.basics,
	experiences = defaultMain.experiences,
	educations = defaultMain.educations,
	skills = defaultMain.skills,
	projects = defaultMain.projects,
	hackathons = defaultMain.hackathons,
	certifications = defaultMain.certifications,
	socials = defaultMain.socials,
	blogEnabled = defaultMain.blogEnabled,
}) {
	const { form, isSubmitting, onSubmit } = useUserContactForm();

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
									<Avatar className="size-20 md:size-28 border mt-2">
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
						className={`prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert`}
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
											className={`inline-block rounded-lg bg-foreground text-background px-3 py-1 text-xs md:text-sm`}
										>
											My Projects
										</div>
										<h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl">
											Check out my latest work
										</h2>
										<p
											className={`text-sm text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
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
														"block cursor-pointer"
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
											className={`inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm`}
										>
											Certifications
										</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
											I value learning
										</h2>
										<p
											className={`text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
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
																className={`text-xs text-muted-foreground`}
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
																className={`text-sm text-muted-foreground`}
															>
																Issued by{" "}
																{issuer}
															</p>
														)}

														{summary && (
															<p
																className={`prose dark:prose-invert text-sm text-muted-foreground`}
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
						<div className="space-y-12 py-12">
							<BlurFade delay={BLUR_FADE_DELAY * 13}>
								<div className="flex flex-col items-center justify-center space-y-4 text-center">
									<div className="space-y-2">
										<div
											className={`inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm`}
										>
											Hackathons
										</div>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
											I like building things
										</h2>
										<p
											className={`text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
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
								<ul className="mb-4 ml-6 divide-y divide-dashed border-l">
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
																className={`text-xs text-muted-foreground`}
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
																className={`text-sm text-muted-foreground`}
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
																className={`prose dark:prose-invert text-sm text-muted-foreground`}
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
									className={`bg-primary/10 text-primary hover:bg-primary/20 mb-4`}
								>
									Get In Touch
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Let&rsquo;s Work Together
								</h2>
								<div
									className={`w-20 h-1 bg-primary rounded-full mb-6`}
								></div>
								<p
									className={`text-muted-foreground text-lg max-w-2xl`}
								>
									Have a project in mind? Let&rsquo;s discuss
									how I can help bring your ideas to life.
								</p>
							</div>

							<div className="max-w-3xl mx-auto">
								<Card className="bg-card border-border overflow-hidden">
									<div className="grid grid-cols-1 md:grid-cols-2">
										<div className={`p-8 bg-primary/5`}>
											<h3 className="text-xl font-bold mb-6">
												Contact Information
											</h3>
											<div className="space-y-6">
												{basics.email && (
													<div>
														<p
															className={`text-muted-foreground mb-1 text-sm`}
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
															className={`text-muted-foreground mb-1 text-sm`}
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
															className={`text-muted-foreground mb-1 text-sm`}
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
																			`rounded-full border border-border hover:border-primary hover:text-primary`
																		)}
																	>
																		{getSocialIcon(
																			social
																		)}
																		<span className="sr-only">
																			{social.network
																				.charAt(
																					0
																				)
																				.toLocaleUpperCase() +
																				social.network.slice(
																					1
																				)}
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
																		`rounded-full border border-border hover:border-primary hover:text-primary`
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
											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(
														onSubmit
													)}
													className="space-y-4"
												>
													<div className="grid grid-cols-2 gap-4">
														<FormField
															control={
																form.control
															}
															name="full_name"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel className="text-sm font-medium">
																		Name
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			className={
																				"w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="email"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel className="text-sm font-medium">
																		Email
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			className={`w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name="subject"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium">
																	Subject
																</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		className={`w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="message"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium">
																	Message
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		rows={4}
																		className={`w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
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
											</Form>
										</div>
									</div>
								</Card>
							</div>
						</div>
					</BlurFade>
				</section>
			</div>
		</main>
	);
}
