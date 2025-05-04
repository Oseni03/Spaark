"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
	Github,
	Mail,
	Linkedin,
	ExternalLink,
	Menu,
	X,
	ArrowRight,
	Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HTMLReactParser from "html-react-parser";

export default function VioletVista({
	basics = defaultMain.basics,
	experiences = defaultMain.experiences,
	educations = defaultMain.educations,
	skills = defaultMain.skills,
	projects = defaultMain.projects,
	hackathons = defaultMain.hackathons,
	certifications = defaultMain.certifications,
	profiles = defaultMain.profiles,
	blogEnabled = defaultMain.blogEnabled,
}) {
	const [activeSection, setActiveSection] = useState("home");
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname();
	const isBlogActive = pathname === "/blog";

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

	return (
		<div className="bg-[#111111] text-white min-h-screen">
			{/* Mobile Menu */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							type: "spring",
							damping: 25,
							stiffness: 300,
						}}
						className="fixed inset-0 bg-[#111111] z-50 lg:hidden"
					>
						<div className="flex justify-end p-6">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMenuOpen(false)}
							>
								<X className="h-6 w-6" />
							</Button>
						</div>
						<nav className="flex flex-col items-center justify-center h-[80vh] gap-8 text-2xl">
							{sections.map(
								(section) =>
									section.visible && (
										<a
											key={section.id}
											href={`#${section.id}`}
											onClick={() => setMenuOpen(false)}
											className={cn(
												"hover:text-[#FF4D4D] transition-colors",
												activeSection === section.id &&
													"text-[#FF4D4D]"
											)}
										>
											{section.id
												.charAt(0)
												.toUpperCase() +
												section.id.slice(1)}
										</a>
									)
							)}
							{blogEnabled && (
								<a
									href={`/blog`}
									onClick={() => setMenuOpen(false)}
									className={cn(
										"hover:text-[#FF4D4D] transition-colors",
										isBlogActive && "text-[#FF4D4D]"
									)}
								>
									Blog
								</a>
							)}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			<header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111111]/80 backdrop-blur-md border-b border-[#222222]">
				<div className="container mx-auto px-6 py-4 flex justify-between items-center">
					<div className="text-2xl font-bold">
						{basics?.name?.split(" ")[0]}{" "}
						<span className="text-[#FF4D4D]">
							{basics?.name.split(" ").slice(1).join(" ")}
						</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden"
						onClick={() => setMenuOpen(true)}
					>
						<Menu className="h-6 w-6" />
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<section
					id="home"
					className="min-h-screen pt-20 lg:pt-0 flex items-center relative"
				>
					<div className="absolute inset-0 z-0 overflow-hidden">
						<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FF4D4D]/10 blur-[120px] rounded-full"></div>
						<div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#FF4D4D]/5 blur-[100px] rounded-full"></div>
					</div>

					<div className="container mx-auto px-6 py-20 relative z-10">
						<div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									{basics.headline}
								</Badge>
								<h1 className="text-5xl md:text-7xl font-bold mb-6">
									{basics.name.split(" ")[0]}{" "}
									<span className="text-[#FF4D4D]">
										{basics.name.split(" ").slice(1)}
									</span>
								</h1>
								<div className="text-xl text-gray-400 mb-8 max-w-xl">
									{HTMLReactParser(
										basics.summary ||
											`I build exceptional and accessible
										digital experiences for the web.`
									)}
								</div>

								<div className="flex flex-col sm:flex-row gap-4">
									<Button
										size="lg"
										className="bg-[#FF4D4D] hover:bg-[#FF3333] text-white"
										onClick={() =>
											document
												.getElementById("projects")
												?.scrollIntoView({
													behavior: "smooth",
												})
										}
									>
										View My Work
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
									<Button
										size="lg"
										variant="outline"
										className="border-[#333333] text-white hover:bg-[#222222]"
										onClick={() =>
											document
												.getElementById("contact")
												?.scrollIntoView({
													behavior: "smooth",
												})
										}
									>
										Contact Me
									</Button>
								</div>
							</motion.div>

							{basics.picture && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.5,
										delay: 0.2,
									}}
									className="relative"
								>
									<div className="relative w-full aspect-square max-w-md mx-auto">
										<div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/20 to-transparent rounded-2xl blur-xl"></div>
										<div className="relative z-10 bg-[#1A1A1A] border border-[#333333] rounded-2xl overflow-hidden p-4">
											<Image
												src={basics.picture}
												alt={
													basics.name ||
													"Portfolio image"
												}
												width={600}
												height={600}
												className="w-full h-full object-cover rounded-xl"
											/>
										</div>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20 relative">
					<div className="absolute inset-0 z-0 overflow-hidden">
						<div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
					</div>

					<div className="container mx-auto px-6 relative z-10">
						<div className="max-w-4xl mx-auto">
							<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
								About Me
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								My Background
							</h2>
							<div className="text-gray-300 text-lg mb-8">
								{HTMLReactParser(basics.about || "")}
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
								<div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
									<div className="text-3xl font-bold text-[#FF4D4D] mb-2">
										7+
									</div>
									<div className="text-gray-400">
										Years Experience
									</div>
								</div>
								<div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
									<div className="text-3xl font-bold text-[#FF4D4D] mb-2">
										60+
									</div>
									<div className="text-gray-400">
										Projects Completed
									</div>
								</div>
								<div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
									<div className="text-3xl font-bold text-[#FF4D4D] mb-2">
										25+
									</div>
									<div className="text-gray-400">
										Happy Clients
									</div>
								</div>
								<div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
									<div className="text-3xl font-bold text-[#FF4D4D] mb-2">
										10+
									</div>
									<div className="text-gray-400">
										Awards Received
									</div>
								</div>
							</div>

							{educations.length > 0 && (
								<div className="flex flex-col md:flex-row gap-6">
									<div className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
										<h3 className="text-xl font-bold mb-4">
											Education
										</h3>
										<div className="space-y-4">
											{educations.map(
												(education, index) => (
													<div key={index}>
														<div className="text-[#FF4D4D] font-medium">
															{education.date}
														</div>
														<div className="font-bold">
															{
																education.studyType
															}
														</div>
														<div className="text-gray-400">
															{
																education.institution
															}
														</div>
													</div>
												)
											)}
										</div>
									</div>

									{experiences.length > 0 && (
										<div className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
											<h3 className="text-xl font-bold mb-4">
												Experience
											</h3>
											<div className="space-y-4">
												{experiences.map(
													(experience, index) => (
														<div key={index}>
															<div className="text-[#FF4D4D] font-medium">
																{
																	experience.date
																}
															</div>
															<div className="font-bold">
																{
																	experience.position
																}
															</div>
															<div className="text-gray-400">
																{
																	experience.company
																}
															</div>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>
							)}

							<div className="mt-12 flex justify-center">
								<Button className="bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333]">
									<Download className="mr-2 h-4 w-4" />
									Download Resume
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				{projects.length > 0 && (
					<section id="projects" className="py-20 relative">
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									My Work
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Featured Projects
								</h2>
								<p className="text-gray-300">
									Here are some of my recent projects that
									showcase my skills and expertise.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Project 1 */}
								{projects.map((project, index) => (
									<Card
										key={index}
										className="bg-[#1A1A1A] border-[#333333] overflow-hidden group"
									>
										<div className="relative h-64 w-full overflow-hidden">
											{project.image && (
												<Image
													src={project.image}
													alt={project.name}
													height={256}
													width={512}
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
											<div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-80"></div>
											<div className="absolute bottom-0 left-0 p-6">
												<Badge className="bg-[#FF4D4D]/20 text-[#FF4D4D] hover:bg-[#FF4D4D]/30">
													Web Application
												</Badge>
												<h3 className="text-2xl font-bold mt-2">
													{project.name}
												</h3>
											</div>
										</div>
										<CardContent className="p-6">
											<div className="text-gray-300 mb-4">
												{HTMLReactParser(
													project.description || ""
												)}
											</div>
											{projects.technologies && (
												<div className="flex flex-wrap gap-2 mb-6">
													{project.technologies.map(
														(tag, index) => (
															<Badge
																key={index}
																variant="outline"
																className="border-[#333333] text-gray-300"
															>
																{tag}
															</Badge>
														)
													)}
												</div>
											)}

											<div className="flex gap-3">
												{project.source && (
													<Link
														href={project.source}
														target="_blank"
													>
														<Button
															variant="outline"
															size="sm"
															className="border-[#333333] hover:bg-[#222222]"
														>
															<Github className="mr-2 h-4 w-4" />
															Code
														</Button>
													</Link>
												)}

												{project.website && (
													<Link
														href={project.website}
														target="_blank"
													>
														<Button
															size="sm"
															className="bg-[#FF4D4D] hover:bg-[#FF3333] text-white"
														>
															<ExternalLink className="mr-2 h-4 w-4" />
															Live Demo
														</Button>
													</Link>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Skills Section */}
				{skills.length > 0 && (
					<section id="skills" className="py-20 relative">
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									My Skills
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Technical Expertise
								</h2>
								<p className="text-gray-300">
									I specialize in a range of technologies
									across the full stack development spectrum.
								</p>
							</div>

							<div className="max-w-3xl mx-auto">
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{/* Frontend Skills */}
									{skills.map((skill, index) => (
										<div
											key={index}
											className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center hover:border-[#FF4D4D] transition-colors"
										>
											<div className="font-medium mb-2">
												{skill.name}
											</div>
											{skill.description && (
												<div className="text-sm text-gray-400">
													{skill.description}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Experiences Section */}
				{experiences.length > 0 && (
					<section id="experiences" className="py-20 relative">
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									Work History
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Professional Experience
								</h2>
								<p className="text-gray-300">
									My journey through various roles and
									companies in the tech industry.
								</p>
							</div>

							<div className="max-w-3xl mx-auto space-y-12">
								{/* Experience Item 1 */}
								{experiences.map((experience, index) => (
									<div
										key={index}
										className="relative pl-8 md:pl-0"
									>
										<div className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#333333]"></div>
										<div className="hidden md:flex absolute left-0 top-0 -translate-x-1/2 h-6 w-6 rounded-full bg-[#FF4D4D] items-center justify-center">
											<div className="h-2 w-2 rounded-full bg-white"></div>
										</div>

										<div className="md:ml-12">
											<div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FF4D4D] transition-colors">
												<div className="flex md:items-center mb-4">
													<div>
														<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-2">
															{experience.date}
														</Badge>
														<h3 className="text-xl font-bold">
															{
																experience.position
															}
														</h3>
														<p className="text-gray-400">
															{experience.company}
														</p>
													</div>
												</div>
												<div className="text-gray-300">
													{HTMLReactParser(
														experience.summary || ""
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Education Section */}
				{educations.length > 0 && (
					<section
						id="education"
						className="py-20 bg-[#0D0D0D] relative"
					>
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									Academic Background
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Education
								</h2>
								<p className="text-gray-300">
									My academic journey and qualifications that
									built the foundation for my career.
								</p>
							</div>

							<div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Education Item 1 */}
								{educations.map((education, index) => (
									<div
										key={index}
										className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FF4D4D] transition-colors"
									>
										<div className="flex items-center justify-between mb-4">
											<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20">
												{education.date}
											</Badge>
											<div className="text-sm text-gray-400">
												California, USA
											</div>
										</div>
										<h3 className="text-xl font-bold mb-2">
											{education.studyType}
										</h3>
										<p className="text-gray-400 mb-4">
											{education.institution}
										</p>
										<div className="mt-4 p-4 border-t border-[#333333]">
											<p className="text-gray-300 mb-4">
												{education.summary}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Hackathons Section */}
				{hackathons.length > 0 && (
					<section id="hackathons" className="py-20 relative">
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									Coding Competitions
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Hackathons
								</h2>
								<p className="text-gray-300">
									Competitions where I&rsquo;ve collaborated
									with teams to build innovative solutions
									under time constraints.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Hackathon Item 1 */}
								{hackathons.map((hackathon, index) => (
									<div
										key={index}
										className="group bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden hover:border-[#FF4D4D] transition-colors"
									>
										<div className="relative h-48 w-full overflow-hidden">
											{hackathon.logo && (
												<Image
													src={hackathon.logo}
													alt={hackathon.name}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-105"
												/>
											)}

											<div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-80"></div>
											<div className="absolute top-4 right-4">
												<Badge className="bg-[#FF4D4D] text-white">
													{hackathon.location}
												</Badge>
											</div>
											<div className="absolute bottom-4 left-4">
												<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20">
													{hackathon.date}
												</Badge>
											</div>
										</div>
										<div className="p-6">
											<h3 className="text-xl font-bold mb-2">
												{hackathon.name}
											</h3>
											<p className="text-gray-300 mb-4">
												{HTMLReactParser(
													hackathon.description || ""
												)}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Certifications Section */}
				{certifications.length > 0 && (
					<section
						id="certifications"
						className="py-20 bg-[#0D0D0D] relative"
					>
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
						</div>

						<div className="container mx-auto px-6 relative z-10">
							<div className="max-w-4xl mx-auto text-center mb-16">
								<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
									Professional Development
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Certifications
								</h2>
								<p className="text-gray-300">
									Professional certifications that validate my
									expertise and knowledge in various
									technologies.
								</p>
							</div>

							<div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{/* Certification Item 1 */}
								{certifications.map((certificate, index) => (
									<div
										key={index}
										className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FF4D4D] transition-colors"
									>
										<div className="flex justify-between items-start mb-4">
											<div className="h-12 w-12 rounded-full bg-[#FF4D4D]/10 flex items-center justify-center text-[#FF4D4D]">
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
											<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20">
												{certificate.date}
											</Badge>
										</div>
										<h3 className="text-lg font-bold mb-1">
											{certificate.name}
										</h3>
										<p className="text-gray-400 mb-4">
											{certificate.issuer}
										</p>
										<div className="text-sm text-gray-300">
											{certificate.summary}
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Contact Section */}
				<section id="contact" className="py-20 relative">
					<div className="absolute inset-0 z-0 overflow-hidden">
						<div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#FF4D4D]/10 blur-[100px] rounded-full"></div>
					</div>

					<div className="container mx-auto px-6 relative z-10">
						<div className="max-w-4xl mx-auto text-center mb-16">
							<Badge className="bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 mb-4">
								Get In Touch
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Let&apos;s Work Together
							</h2>
							<p className="text-gray-300">
								Have a project in mind? Let&apos;s discuss how I
								can help bring your ideas to life.
							</p>
						</div>

						<div className="max-w-3xl mx-auto">
							<Card className="bg-[#1A1A1A] border-[#333333] overflow-hidden">
								<CardContent className="p-8">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h3 className="text-xl font-bold mb-4">
												Contact Information
											</h3>
											<div className="space-y-4">
												<div>
													<p className="text-gray-400 mb-1">
														Email
													</p>
													<p className="text-white">
														alex@morgandev.tech
													</p>
												</div>
												<div>
													<p className="text-gray-400 mb-1">
														Location
													</p>
													<p className="text-white">
														San Francisco, CA
													</p>
												</div>
												<div>
													<p className="text-gray-400 mb-1">
														Social Media
													</p>
													<div className="flex gap-3 mt-2">
														<Button
															variant="ghost"
															size="icon"
															className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
														>
															<Github className="h-4 w-4" />
															<span className="sr-only">
																GitHub
															</span>
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
														>
															<Linkedin className="h-4 w-4" />
															<span className="sr-only">
																LinkedIn
															</span>
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
														>
															<Mail className="h-4 w-4" />
															<span className="sr-only">
																Email
															</span>
														</Button>
													</div>
												</div>
											</div>
										</div>

										<div>
											<h3 className="text-xl font-bold mb-4">
												Send a Message
											</h3>
											<div className="space-y-4">
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
															className="w-full p-2 bg-[#222222] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
														/>
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
															className="w-full p-2 bg-[#222222] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
														/>
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
														className="w-full p-2 bg-[#222222] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
													/>
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
														rows={4}
														className="w-full p-2 bg-[#222222] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
													></textarea>
												</div>
												<Button className="w-full bg-[#FF4D4D] hover:bg-[#FF3333] text-white">
													Send Message
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Footer - Only visible on mobile */}
				<footer className="py-10 border-t border-[#222222] lg:hidden">
					<div className="container mx-auto px-6">
						<div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
							<div className="flex gap-4">
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
								>
									<Github className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
								>
									<Linkedin className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full bg-[#222222] hover:bg-[#333333] text-white"
								>
									<Mail className="h-5 w-5" />
								</Button>
							</div>
							<div className="text-sm text-gray-500">
								© 2025 {basics.name}. All rights reserved.
							</div>
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
