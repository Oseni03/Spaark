"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
	Github,
	Mail,
	Linkedin,
	ExternalLink,
	Menu,
	X,
	ArrowRight,
	Download,
	MoonStar,
	Sun,
	ChevronRight,
	ArrowUpRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getInitials, getSocialIcon, getSocialLink } from "@/lib/utils";
import { useTheme } from "next-themes";
import HTMLReactParser from "html-react-parser";
import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react";
import { useUserContactForm } from "@/hooks/use-user-contact-form";
import { Spinner } from "../ui/Spinner";
import { usePathname } from "next/navigation";
import { defaultMain } from "@/schema/sections";

export default function Neomint({
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
	const { theme, setTheme } = useTheme();
	const [activeSection, setActiveSection] = useState("home");
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const sectionsRef = useRef(null);
	const pathname = usePathname();
	const isBlogActive = pathname === "/blog";

	const { formData, errors, isSubmitting, handleChange, handleSubmit } =
		useUserContactForm();

	const sections = useMemo(
		() => [
			{ id: "home", visible: true, items: [] },
			{ id: "about", visible: true, items: [] },
			{
				id: "projects",
				visible: projects.visible && projects.items.length > 0,
				items: projects.items,
			},
			{
				id: "skills",
				visible: skills.visible && skills.items.length > 0,
				items: skills.items,
			},
			{
				id: "experiences",
				visible: experiences.visible && experiences.items.length > 0,
				items: experiences.items,
			},
			{
				id: "education",
				visible: educations.visible && educations.items.length > 0,
				items: educations.items,
			},
			{
				id: "hackathons",
				visible: hackathons.visible && hackathons.items.length > 0,
				items: hackathons.items,
			},
			{
				id: "certifications",
				visible:
					certifications.visible && certifications.items.length > 0,
				items: certifications.items,
			},
			{ id: "contact", visible: true, items: [] },
		],
		[projects, skills, experiences, educations, hackathons, certifications]
	);

	useEffect(() => {
		const handleScroll = () => {
			for (const section of sections) {
				if (!section.visible) continue;
				const element = document.getElementById(section.id);
				if (element) {
					const rect = element.getBoundingClientRect();
					if (rect.top <= 100 && rect.bottom >= 100) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [sections]);

	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setMenuOpen(false);
	};

	return (
		<div
			className={`bg-[${metadata.theme.background}] text-foreground min-h-screen`}
		>
			{/* Header */}
			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-40 transition-all duration-300",
					scrolled
						? `bg-[${metadata.theme.background}]/80 backdrop-blur-md shadow-sm`
						: "bg-transparent"
				)}
			>
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500"></div>
							<span className="text-xl font-bold">
								{basics.name.split(" ")[0]}.dev
							</span>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-8">
							{sections.map((section) => (
								<button
									key={section.id}
									onClick={() => scrollToSection(section.id)}
									className={cn(
										`text-sm font-medium capitalize hover:text-[${metadata.theme.primary}] transition-colors relative`,
										activeSection === section.id &&
											`text-[${metadata.theme.primary}]`
									)}
								>
									{section.id}
									{activeSection === section.id && (
										<motion.div
											layoutId="activeSection"
											className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[${metadata.theme.primary}]`}
											transition={{
												type: "spring",
												duration: 0.5,
											}}
										/>
									)}
								</button>
							))}
						</nav>

						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setTheme(
										theme === "dark" ? "light" : "dark"
									)
								}
								className="rounded-full"
							>
								{theme === "dark" ? (
									<Sun className="h-5 w-5" />
								) : (
									<MoonStar className="h-5 w-5" />
								)}
							</Button>
							<Button
								className="hidden md:flex"
								onClick={() => scrollToSection("contact")}
							>
								<Mail className="mr-2 h-4 w-4" />
								Contact Me
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setMenuOpen(true)}
							>
								<Menu className="h-6 w-6" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className={`fixed inset-0 bg-[${metadata.theme.background}] z-50 pt-20`}
					>
						<div className="flex justify-end p-6 absolute top-0 right-0">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMenuOpen(false)}
							>
								<X className="h-6 w-6" />
							</Button>
						</div>
						<nav className="flex flex-col items-center justify-center h-full gap-8 text-lg">
							{sections.map((section) => (
								<button
									key={section.id}
									onClick={() => scrollToSection(section.id)}
									className={cn(
										`capitalize hover:text-[${metadata.theme.primary}] transition-colors`,
										activeSection === section.id &&
											`text-[${metadata.theme.primary}] font-medium`
									)}
								>
									{section.id}
								</button>
							))}
							{blogEnabled && (
								<Link href={"/blog"}>
									<button
										className={cn(
											`capitalize hover:text-[${metadata.theme.primary}] transition-colors`,
											isBlogActive &&
												`text-[${metadata.theme.primary}] font-medium`
										)}
									>
										blog
									</button>
								</Link>
							)}
							<div className="flex gap-4 mt-8">
								{socials.map((social, index) => (
									<Link
										key={index}
										href={getSocialLink(social)}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											"rounded-full border border-border"
										)}
									>
										{getSocialIcon(social)}
										<span className="sr-only">
											{social.network.toUpperCase()}
										</span>
									</Link>
								))}
								{basics.email && (
									<Link
										href={`mailto:${basics.email}`}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											"rounded-full border border-border"
										)}
									>
										<Mail className="h-5 w-5" />
										<span className="sr-only">Email</span>
									</Link>
								)}
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<main ref={sectionsRef}>
				{/* Hero Section */}
				<section
					id="home"
					className="min-h-screen pt-20 flex items-center"
				>
					<div className="container mx-auto px-6 py-20">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									{basics.headline}
								</Badge>
								<h1 className="text-5xl md:text-6xl font-bold mb-6">
									Hi, I&rsquo;m {basics.name.split(" ")[0]}{" "}
									<span
										className={`text-[${metadata.theme.primary}]`}
									>
										{basics.name
											.split(" ")
											.slice(1)
											.join(" ")}
									</span>
								</h1>
								<div
									className={`text-xl text-[${metadata.theme.text}] mb-8 max-w-xl`}
								>
									{HTMLReactParser(
										basics.summary ||
											`I build exceptional and accessible
										digital experiences for the web.`
									)}
								</div>

								<div className="flex flex-col sm:flex-row gap-4">
									<Button
										size="lg"
										className="group"
										onClick={() =>
											scrollToSection("projects")
										}
									>
										View My Work
										<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button>
									<Button
										size="lg"
										variant="outline"
										onClick={() =>
											scrollToSection("contact")
										}
									>
										Contact Me
									</Button>
								</div>

								<div className="flex items-center gap-6 mt-12">
									{socials.map((social, index) => (
										<Link
											key={index}
											href={getSocialLink(social)}
											className={cn(
												buttonVariants({
													variant: "ghost",
													size: "icon",
												}),
												`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
											)}
										>
											{getSocialIcon(social)}
											<span className="sr-only">
												{social.network.toUpperCase()}
											</span>
										</Link>
									))}
									{basics.email && (
										<Link
											href={`mailto:${basics.email}`}
											className={cn(
												buttonVariants({
													variant: "ghost",
													size: "icon",
												}),
												`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
											)}
										>
											<Mail className="h-5 w-5" />
											<span className="sr-only">
												Email
											</span>
										</Link>
									)}
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="relative"
							>
								<div className="relative w-full aspect-square max-w-md mx-auto">
									<div
										className={`absolute inset-0 bg-gradient-to-br from-[${metadata.theme.primary}]/20 to-transparent rounded-full blur-xl`}
									></div>
									<div className="relative z-10 bg-card border border-border rounded-full overflow-hidden p-4">
										<Image
											src="/placeholder.svg?height=600&width=600"
											alt="Jordan Chen"
											width={600}
											height={600}
											className="w-full h-full object-cover rounded-full"
										/>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20">
					<div className="container mx-auto px-6">
						<div className="max-w-3xl mx-auto">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									About Me
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									My Background
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg`}
								>
									Get to know more about me, my experience,
									and what drives me as a developer.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
								<div>
									<h3 className="text-2xl font-bold mb-4">
										My Story
									</h3>
									<p
										className={`text-[${metadata.theme.text}] mb-6`}
									>
										{HTMLReactParser(basics.about || "")}
									</p>
									{/* <Button variant="outline" className="group">
										<Download className="mr-2 h-4 w-4" />
										Download Resume
										<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button> */}
								</div>

								<div className="grid grid-cols-2 gap-4">
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div
												className={`text-3xl font-bold text-[${metadata.theme.primary}] mb-2`}
											>
												7+
											</div>
											<div
												className={`text-[${metadata.theme.text}]`}
											>
												Years Experience
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div
												className={`text-3xl font-bold text-[${metadata.theme.primary}] mb-2`}
											>
												60+
											</div>
											<div
												className={`text-[${metadata.theme.text}]`}
											>
												Projects Completed
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div
												className={`text-3xl font-bold text-[${metadata.theme.primary}] mb-2`}
											>
												25+
											</div>
											<div
												className={`text-[${metadata.theme.text}]`}
											>
												Happy Clients
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div
												className={`text-3xl font-bold text-[${metadata.theme.primary}] mb-2`}
											>
												10+
											</div>
											<div
												className={`text-[${metadata.theme.text}]`}
											>
												Awards Received
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				{projects.length > 0 && (
					<section id="projects" className="py-20 bg-muted/30">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									My Work
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Featured Projects
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									Here are some of my recent projects that
									showcase my skills and expertise in web
									development and design.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{/* Project 1 */}
								{projects.map((project, index) => (
									<Card
										key={index}
										className={`group overflow-hidden bg-card border-border hover:border-[${metadata.theme.primary}] transition-colors`}
									>
										<div className="relative h-56 w-full overflow-hidden">
											{project.image && (
												<Image
													src={project.image}
													alt={project.name}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-110"
												/>
											)}
											{project.video && (
												<video
													src={project.video}
													autoPlay
													loop
													muted
													playsInline
													className="pointer-events-none mx-auto h-32 md:h-40 w-full object-cover object-top"
												/>
											)}
										</div>
										<CardContent className="p-6">
											{project.type && (
												<Badge
													className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-3`}
												>
													{project.type}
												</Badge>
											)}
											<h3
												className={`text-xl font-bold mb-2 group-hover:text-[${metadata.theme.primary}] transition-colors`}
											>
												{project.name}
											</h3>
											<div
												className={`text-[${metadata.theme.text}] mb-4 line-clamp-2`}
											>
												{HTMLReactParser(
													project.description
												)}
											</div>
											{project.technologies && (
												<div className="flex flex-wrap gap-2 mb-6">
													{project.technologies.map(
														(tech, index) => (
															<Badge
																key={index}
																variant="outline"
																className={`border-border text-[${metadata.theme.text}]`}
															>
																{tech}
															</Badge>
														)
													)}
												</div>
											)}
											<div className="flex gap-3">
												{project.source && (
													<Link
														href={project.source}
														className={cn(
															buttonVariants({
																variant:
																	"outline",
																size: "sm",
															}),
															"group/btn"
														)}
													>
														<GithubLogo className="mr-2 h-4 w-4" />
														Code
														<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
													</Link>
												)}
												{project.website && (
													<Link
														href={project.website}
														className={cn(
															buttonVariants({
																size: "sm",
															})
														)}
													>
														<ExternalLink className="mr-2 h-4 w-4" />
														Demo
													</Link>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* <div className="mt-12 text-center">
								<Button variant="outline" className="group">
									View All Projects
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</div> */}
						</div>
					</section>
				)}

				{/* Skills Section */}
				{skills.length > 0 && (
					<section id="skills" className="py-20">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									My Skills
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Technical Expertise
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									I specialize in a range of technologies
									across the full stack development spectrum.
								</p>
							</div>

							<div className="max-w-5xl mx-auto">
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
									{/* Frontend */}
									{skills.map((skill, index) => (
										<Card
											key={index}
											className={`bg-card border-border hover:border-[${metadata.theme.primary}] hover:shadow-md transition-all`}
										>
											<CardContent className="p-6 text-center">
												<div
													className={`h-12 w-12 bg-[${metadata.theme.primary}]/10 rounded-full flex items-center justify-center mx-auto mb-4`}
												>
													<div
														className={`text-[${metadata.theme.primary}] text-xl font-bold`}
													>
														{getInitials(
															skill.name
														)}
													</div>
												</div>
												<h3 className="font-medium mb-1">
													{skill.name}
												</h3>
												{skill.level && (
													<p
														className={`text-xs text-[${metadata.theme.text}]`}
													>
														{skill.level}
													</p>
												)}
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Experiences Section */}
				{experiences.length && (
					<section id="experiences" className="py-20 bg-muted/30">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									Work History
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Professional Experience
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									My journey through various roles and
									companies in the tech industry.
								</p>
							</div>

							<div className="max-w-4xl mx-auto">
								<div className="relative">
									{/* Timeline line */}
									<div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2"></div>

									{experiences.map((experience, index) => {
										const isEven = index % 2 === 0;

										if (isEven) {
											return (
												<div
													key={index}
													className="relative mb-16"
												>
													<div className="flex flex-col md:flex-row items-center">
														<div className="flex md:w-1/2 md:justify-end mb-8 md:mb-0 md:pr-12">
															<div
																className={`bg-card border border-border p-6 rounded-lg shadow-sm md:max-w-md w-full hover:border-[${metadata.theme.primary}] transition-colors`}
															>
																<Badge
																	className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-2`}
																>
																	{
																		experience.date
																	}
																</Badge>
																<h3 className="text-xl font-bold mb-1">
																	{
																		experience.headline
																	}
																</h3>
																<p
																	className={`text-[${metadata.theme.text}]`}
																>
																	{
																		experience.company
																	}
																</p>
															</div>
														</div>
														<div
															className={`absolute left-0 md:left-1/2 top-8 md:top-12 w-8 h-8 rounded-full bg-[${metadata.theme.primary}] flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10`}
														>
															<div
																className={`w-3 h-3 rounded-full bg-[${metadata.theme.background}]`}
															></div>
														</div>
														<div className="md:w-1/2 md:pl-12 md:pt-16">
															<div className="text-sm mb-4">
																{HTMLReactParser(
																	experience.summary
																)}
															</div>
															{experience.technologies && (
																<div className="flex flex-wrap gap-2">
																	{experience.technologies.map(
																		(
																			tech,
																			index
																		) => (
																			<Badge
																				key={
																					index
																				}
																				variant="outline"
																				className={`border-border text-[${metadata.theme.text}]`}
																			>
																				{
																					tech
																				}
																			</Badge>
																		)
																	)}
																</div>
															)}
														</div>
													</div>
												</div>
											);
										} else {
											return (
												<div
													key={index}
													className="relative mb-16"
												>
													<div className="flex flex-col md:flex-row items-center">
														<div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
															<div className="text-sm mb-4">
																{HTMLReactParser(
																	experience.summary
																)}
															</div>
															{experience.technologies && (
																<div className="flex flex-wrap gap-2 justify-end">
																	{experience.technologies.map(
																		(
																			tech,
																			index
																		) => (
																			<Badge
																				key={
																					index
																				}
																				variant="outline"
																				className={`border-border text-[${metadata.theme.text}]`}
																			>
																				{
																					tech
																				}
																			</Badge>
																		)
																	)}
																</div>
															)}
														</div>
														<div
															className={`absolute left-0 md:left-1/2 top-8 md:top-12 w-8 h-8 rounded-full bg-[${metadata.theme.primary}] flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10`}
														>
															<div
																className={`w-3 h-3 rounded-full bg-[${metadata.theme.background}]`}
															></div>
														</div>
														<div className="flex md:w-1/2 md:justify-start mb-8 md:mb-0 md:pl-12 order-1 md:order-2">
															<div
																className={`*:bg-card border border-border p-6 rounded-lg shadow-sm md:max-w-md w-full hover:border-[${metadata.theme.primary}] transition-colors`}
															>
																<Badge
																	className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-2`}
																>
																	{
																		experience.date
																	}
																</Badge>
																<h3 className="text-xl font-bold mb-1">
																	{
																		experience.headline
																	}
																</h3>
																<p
																	className={`text-[${metadata.theme.text}]`}
																>
																	{
																		experience.company
																	}
																</p>
															</div>
														</div>
													</div>
												</div>
											);
										}
									})}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Education Section */}
				{educations.length > 0 && (
					<section id="education" className="py-20">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									Academic Background
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Education
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									My academic journey and qualifications that
									built the foundation for my career.
								</p>
							</div>

							<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Education Item 1 */}
								{educations.map((edu, index) => (
									<Card
										key={index}
										className={`bg-card border-border hover:border-[${metadata.theme.primary}] hover:shadow-md transition-all`}
									>
										<CardContent className="p-6">
											<div className="flex items-center justify-between mb-4">
												<Badge
													className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20`}
												>
													{edu.date}
												</Badge>
												{edu.location && (
													<div
														className={`text-sm text-[${metadata.theme.text}]`}
													>
														{edu.location}
													</div>
												)}
											</div>
											<h3 className="text-xl font-bold mb-1">
												{edu.studyType}
											</h3>
											<p
												className={`text-[${metadata.theme.text}] mb-4`}
											>
												{edu.institution}
											</p>
											<div className="pt-4 border-t border-border text-sm mb-4">
												{HTMLReactParser(edu.summary)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Hackathons Section */}
				{hackathons.length > 0 && (
					<section id="hackathons" className="py-20 bg-muted/30">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									Coding Competitions
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Hackathons
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									Competitions where I&rsquo;ve collaborated
									with teams to build innovative solutions
									under time constraints.
								</p>
							</div>

							<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Hackathon Item 1 */}
								{hackathons.map((hackathon, index) => (
									<Card
										key={index}
										className={`group bg-card border-border hover:border-[${metadata.theme.primary}] hover:shadow-md transition-all overflow-hidden`}
									>
										<div className="relative h-48 w-full overflow-hidden">
											{hackathon.logo && (
												<Image
													src={`${hackathon.logo}?height=192&width=384`}
													alt={hackathon.name}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-105"
												/>
											)}

											<div
												className={`absolute inset-0 bg-gradient-to-t from-[${metadata.theme.background}]/90 to-[${metadata.theme.background}]/20`}
											></div>
											<div
												className={`absolute inset-0 bg-gradient-to-t from-[${metadata.theme.background}]/90 to-[${metadata.theme.background}]/20`}
											></div>
											<div className="absolute top-4 right-4">
												<Badge
													className={`bg-[${metadata.theme.primary}]/60 text-[${metadata.theme.primary}]-foreground`}
												>
													Finalist
												</Badge>
											</div>
											<div
												className={`absolute inset-0 bg-gradient-to-t from-[${metadata.theme.background}]/90 to-[${metadata.theme.background}]/20`}
											></div>
											<div className="absolute top-4 right-4">
												<Badge
													className={`bg-[${metadata.theme.primary}]/60 text-[${metadata.theme.primary}]-foreground`}
												>
													Finalist
												</Badge>
											</div>
											<div className="absolute bottom-4 left-4">
												<Badge
													className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20`}
												>
													{hackathon.date}
												</Badge>
											</div>
										</div>
										<CardContent className="p-6">
											<h3
												className={`text-xl font-bold mb-2 group-hover:text-[${metadata.theme.primary}] transition-colors`}
											>
												{hackathon.name}
											</h3>
											<div
												className={`text-[${metadata.theme.text}] mb-4 text-sm`}
											>
												{HTMLReactParser(
													hackathon.description
												)}
											</div>
											{hackathon.technologies && (
												<div className="flex flex-wrap gap-2 mb-4">
													{hackathon.technologies.map(
														(technology, index) => (
															<Badge
																key={index}
																variant="outline"
																className={`border-border text-[${metadata.theme.text}]`}
															>
																{technology}
															</Badge>
														)
													)}
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Certifications Section */}
				{certifications.length > 0 && (
					<section id="certifications" className="py-20">
						<div className="container mx-auto px-6">
							<div className="flex flex-col items-center text-center mb-12">
								<Badge
									className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20 mb-4`}
								>
									Professional Development
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Certifications
								</h2>
								<div
									className={`w-20 h-1 bg-[${metadata.theme.primary}] rounded-full mb-6`}
								></div>
								<p
									className={`text-[${metadata.theme.text}] text-lg max-w-2xl`}
								>
									Professional certifications that validate my
									expertise and knowledge in various
									technologies.
								</p>
							</div>

							<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Certification Item 1 */}
								{certifications.map((certification, index) => (
									<Card
										key={index}
										className={`bg-card border-border hover:border-[${metadata.theme.primary}] hover:shadow-md transition-all`}
									>
										<CardContent className="p-6">
											<div className="flex justify-between items-start mb-4">
												<div
													className={`h-12 w-12 rounded-full bg-[${metadata.theme.primary}]/10 flex items-center justify-center text-[${metadata.theme.primary}]`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
														<polyline points="22 4 12 14.01 9 11.01"></polyline>
													</svg>
												</div>
												<Badge
													className={`bg-[${metadata.theme.primary}]/10 text-[${metadata.theme.primary}] hover:bg-[${metadata.theme.primary}]/20`}
												>
													{certification.date}
												</Badge>
											</div>
											<h3 className="text-lg font-bold mb-1">
												{certification.name}
											</h3>
											<p
												className={`text-[${metadata.theme.text}] mb-4`}
											>
												{certification.issuer}
											</p>
											<div
												className={`text-sm text-[${metadata.theme.text}]`}
											>
												{HTMLReactParser(
													certification.summary
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Contact Section */}
				<section id="contact" className="py-20 bg-muted/30">
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
								Have a project in mind? Let&rsquo;s discuss how
								I can help bring your ideas to life.
							</p>
						</div>

						<div className="max-w-4xl mx-auto">
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
															(social, index) => (
																<Link
																	key={index}
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
														onChange={handleChange}
														className={cn(
															errors.full_name
																? "border-red-500"
																: "",
															`w-full p-2 bg-[${metadata.theme.background}] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[${metadata.theme.primary}] focus:border-transparent`
														)}
													/>
													{errors.full_name && (
														<p className="text-red-500">
															{errors.full_name}
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
														value={formData.email}
														onChange={handleChange}
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
												{isSubmitting && <Spinner />}
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
				</section>

				{/* Footer */}
				<footer className="py-10 border-t border-border">
					<div className="container mx-auto px-6">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<div className="flex items-center gap-2">
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500"></div>
								<span className="text-xl font-bold">
									{basics.name.split(" ")[0]}.dev
								</span>
							</div>
							<div
								className={`text-sm text-[${metadata.theme.text}]`}
							>
								© 2025 {basics.name}. All rights reserved.
							</div>
							<div className="flex gap-4">
								{socials.map((social, index) => (
									<Link
										key={index}
										href={getSocialLink(social)}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
										)}
									>
										{getSocialIcon(social)}
									</Link>
								))}
								{basics.email && (
									<Link
										href={`mailto:${basics.email}`}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											`rounded-full border border-border hover:border-[${metadata.theme.primary}] hover:text-[${metadata.theme.primary}]`
										)}
									>
										<Mail className="h-5 w-5" />
									</Link>
								)}
							</div>
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
