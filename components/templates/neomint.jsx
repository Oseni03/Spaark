"use client";

import { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import HTMLReactParser from "html-react-parser";

export default function Portfolio({
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
	const { theme, setTheme } = useTheme();
	const [activeSection, setActiveSection] = useState("home");
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const sectionsRef = useRef < HTMLDivElement > null;

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
		<div className="bg-background text-foreground min-h-screen">
			{/* Header */}
			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-40 transition-all duration-300",
					scrolled
						? "bg-background/80 backdrop-blur-md shadow-sm"
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
										"text-sm font-medium capitalize hover:text-primary transition-colors relative",
										activeSection === section.id &&
											"text-primary"
									)}
								>
									{section.id}
									{activeSection === section.id && (
										<motion.div
											layoutId="activeSection"
											className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
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
							<Button className="hidden md:flex">
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
						className="fixed inset-0 bg-background z-50 pt-20"
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
										"capitalize hover:text-primary transition-colors",
										activeSection === section.id &&
											"text-primary font-medium"
									)}
								>
									{section.id}
								</button>
							))}
							<div className="flex gap-4 mt-8">
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border"
								>
									<Github className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border"
								>
									<Linkedin className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border"
								>
									<Mail className="h-5 w-5" />
								</Button>
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
								<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
									{basics.headline}
								</Badge>
								<h1 className="text-5xl md:text-6xl font-bold mb-6">
									Hi, I&rsquo;m {basics.name.split(" ")[0]}{" "}
									<span className="text-primary">
										{basics.name
											.split(" ")
											.slice(1)
											.join(" ")}
									</span>
								</h1>
								<div className="text-xl text-muted-foreground mb-8 max-w-xl">
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
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full border border-border hover:border-primary hover:text-primary"
									>
										<Github className="h-5 w-5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full border border-border hover:border-primary hover:text-primary"
									>
										<Linkedin className="h-5 w-5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full border border-border hover:border-primary hover:text-primary"
									>
										<Mail className="h-5 w-5" />
									</Button>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="relative"
							>
								<div className="relative w-full aspect-square max-w-md mx-auto">
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></div>
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
								<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
									About Me
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									My Background
								</h2>
								<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
								<p className="text-muted-foreground text-lg">
									Get to know more about me, my experience,
									and what drives me as a developer.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
								<div>
									<h3 className="text-2xl font-bold mb-4">
										My Story
									</h3>
									<p className="text-muted-foreground mb-6">
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
											<div className="text-3xl font-bold text-primary mb-2">
												7+
											</div>
											<div className="text-muted-foreground">
												Years Experience
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div className="text-3xl font-bold text-primary mb-2">
												60+
											</div>
											<div className="text-muted-foreground">
												Projects Completed
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div className="text-3xl font-bold text-primary mb-2">
												25+
											</div>
											<div className="text-muted-foreground">
												Happy Clients
											</div>
										</CardContent>
									</Card>
									<Card className="bg-card border-border">
										<CardContent className="p-6 text-center">
											<div className="text-3xl font-bold text-primary mb-2">
												10+
											</div>
											<div className="text-muted-foreground">
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
								<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
									My Work
								</Badge>
								<h2 className="text-4xl font-bold mb-6">
									Featured Projects
								</h2>
								<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
								<p className="text-muted-foreground text-lg max-w-2xl">
									Here are some of my recent projects that
									showcase my skills and expertise in web
									development and design.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{/* Project 1 */}
								<Card className="group overflow-hidden bg-card border-border hover:border-primary transition-colors">
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src="/placeholder.svg?height=224&width=384"
											alt="Project thumbnail"
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									</div>
									<CardContent className="p-6">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
											Web Application
										</Badge>
										<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
											Finance Dashboard
										</h3>
										<p className="text-muted-foreground mb-4 line-clamp-2">
											A comprehensive financial dashboard
											with real-time data visualization
											and analytics.
										</p>
										<div className="flex flex-wrap gap-2 mb-6">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												React
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												TypeScript
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												D3.js
											</Badge>
										</div>
										<div className="flex gap-3">
											<Button
												variant="outline"
												size="sm"
												className="group/btn"
											>
												<Github className="mr-2 h-4 w-4" />
												Code
												<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
											</Button>
											<Button size="sm">
												<ExternalLink className="mr-2 h-4 w-4" />
												Demo
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Project 2 */}
								<Card className="group overflow-hidden bg-card border-border hover:border-primary transition-colors">
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src="/placeholder.svg?height=224&width=384"
											alt="Project thumbnail"
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									</div>
									<CardContent className="p-6">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
											E-commerce
										</Badge>
										<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
											Luxury Store
										</h3>
										<p className="text-muted-foreground mb-4 line-clamp-2">
											A high-end e-commerce platform with
											seamless checkout and product
											management.
										</p>
										<div className="flex flex-wrap gap-2 mb-6">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Next.js
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Tailwind CSS
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Stripe
											</Badge>
										</div>
										<div className="flex gap-3">
											<Button
												variant="outline"
												size="sm"
												className="group/btn"
											>
												<Github className="mr-2 h-4 w-4" />
												Code
												<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
											</Button>
											<Button size="sm">
												<ExternalLink className="mr-2 h-4 w-4" />
												Demo
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Project 3 */}
								<Card className="group overflow-hidden bg-card border-border hover:border-primary transition-colors">
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src="/placeholder.svg?height=224&width=384"
											alt="Project thumbnail"
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									</div>
									<CardContent className="p-6">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
											Mobile App
										</Badge>
										<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
											Fitness Tracker
										</h3>
										<p className="text-muted-foreground mb-4 line-clamp-2">
											A mobile fitness application with
											workout tracking and personalized
											recommendations.
										</p>
										<div className="flex flex-wrap gap-2 mb-6">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												React Native
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Firebase
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Redux
											</Badge>
										</div>
										<div className="flex gap-3">
											<Button
												variant="outline"
												size="sm"
												className="group/btn"
											>
												<Github className="mr-2 h-4 w-4" />
												Code
												<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
											</Button>
											<Button size="sm">
												<ExternalLink className="mr-2 h-4 w-4" />
												Demo
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="mt-12 text-center">
								<Button variant="outline" className="group">
									View All Projects
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</div>
						</div>
					</section>
				)}

				{/* Skills Section */}
				<section id="skills" className="py-20">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								My Skills
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Technical Expertise
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								I specialize in a range of technologies across
								the full stack development spectrum.
							</p>
						</div>

						<div className="max-w-5xl mx-auto">
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
								{/* Frontend */}
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												R
											</div>
										</div>
										<h3 className="font-medium mb-1">
											React
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												N
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Next.js
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												TS
											</div>
										</div>
										<h3 className="font-medium mb-1">
											TypeScript
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												TW
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Tailwind
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>

								{/* Backend */}
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												N
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Node.js
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												Ex
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Express
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												M
											</div>
										</div>
										<h3 className="font-medium mb-1">
											MongoDB
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												PG
											</div>
										</div>
										<h3 className="font-medium mb-1">
											PostgreSQL
										</h3>
										<p className="text-xs text-muted-foreground">
											Intermediate
										</p>
									</CardContent>
								</Card>

								{/* DevOps */}
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												D
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Docker
										</h3>
										<p className="text-xs text-muted-foreground">
											Intermediate
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												K8s
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Kubernetes
										</h3>
										<p className="text-xs text-muted-foreground">
											Intermediate
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												AWS
											</div>
										</div>
										<h3 className="font-medium mb-1">
											AWS
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												CI
											</div>
										</div>
										<h3 className="font-medium mb-1">
											CI/CD
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>

								{/* Tools */}
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												G
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Git
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												F
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Figma
										</h3>
										<p className="text-xs text-muted-foreground">
											Intermediate
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												VS
											</div>
										</div>
										<h3 className="font-medium mb-1">
											VS Code
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
								<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
									<CardContent className="p-6 text-center">
										<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
											<div className="text-primary text-xl font-bold">
												JR
											</div>
										</div>
										<h3 className="font-medium mb-1">
											Jest/RTL
										</h3>
										<p className="text-xs text-muted-foreground">
											Advanced
										</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</section>

				{/* Experiences Section */}
				<section id="experiences" className="py-20 bg-muted/30">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								Work History
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Professional Experience
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								My journey through various roles and companies
								in the tech industry.
							</p>
						</div>

						<div className="max-w-4xl mx-auto">
							<div className="relative">
								{/* Timeline line */}
								<div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2"></div>

								{/* Experience 1 */}
								<div className="relative mb-16">
									<div className="flex flex-col md:flex-row items-center">
										<div className="flex md:w-1/2 md:justify-end mb-8 md:mb-0 md:pr-12">
											<div className="bg-card border border-border p-6 rounded-lg shadow-sm md:max-w-md w-full hover:border-primary transition-colors">
												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2">
													2021 - Present
												</Badge>
												<h3 className="text-xl font-bold mb-1">
													Lead Engineer
												</h3>
												<p className="text-muted-foreground mb-4">
													Netflix
												</p>
												<p className="text-sm mb-4">
													Led a team of 8 engineers to
													develop and maintain
													Netflix&rsquo;s internal
													content management system.
													Improved system performance
													by 40% and reduced
													deployment time by 60%
													through CI/CD pipeline
													optimizations.
												</p>
												<div className="flex flex-wrap gap-2">
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														React
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														Node.js
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														AWS
													</Badge>
												</div>
											</div>
										</div>
										<div className="absolute left-0 md:left-1/2 top-8 md:top-12 w-8 h-8 rounded-full bg-primary flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10">
											<div className="w-3 h-3 rounded-full bg-background"></div>
										</div>
										<div className="md:w-1/2 md:pl-12 md:pt-16">
											<ul className="space-y-2 text-sm">
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Architected and
														implemented a new
														microservices
														infrastructure
													</span>
												</li>
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Mentored junior
														developers and
														established coding
														standards
													</span>
												</li>
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Collaborated with
														product managers to
														define technical
														roadmaps
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>

								{/* Experience 2 */}
								<div className="relative mb-16">
									<div className="flex flex-col md:flex-row items-center">
										<div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
											<ul className="space-y-2 text-sm">
												<li className="flex items-start md:justify-end">
													<span className="text-primary mr-2 md:order-2 md:ml-2 md:mr-0">
														•
													</span>
													<span>
														Developed key components
														of the Cloud Console UI
													</span>
												</li>
												<li className="flex items-start md:justify-end">
													<span className="text-primary mr-2 md:order-2 md:ml-2 md:mr-0">
														•
													</span>
													<span>
														Reduced page load time
														by 35% through code
														optimization
													</span>
												</li>
												<li className="flex items-start md:justify-end">
													<span className="text-primary mr-2 md:order-2 md:ml-2 md:mr-0">
														•
													</span>
													<span>
														Implemented
														accessibility
														improvements across the
														platform
													</span>
												</li>
											</ul>
										</div>
										<div className="absolute left-0 md:left-1/2 top-8 md:top-12 w-8 h-8 rounded-full bg-primary flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10">
											<div className="w-3 h-3 rounded-full bg-background"></div>
										</div>
										<div className="flex md:w-1/2 md:justify-start mb-8 md:mb-0 md:pl-12 order-1 md:order-2">
											<div className="bg-card border border-border p-6 rounded-lg shadow-sm md:max-w-md w-full hover:border-primary transition-colors">
												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2">
													2018 - 2021
												</Badge>
												<h3 className="text-xl font-bold mb-1">
													Senior Developer
												</h3>
												<p className="text-muted-foreground mb-4">
													Google
												</p>
												<p className="text-sm mb-4">
													Worked on Google Cloud
													Platform&rsquo;s developer
													console, focusing on user
													experience and performance
													optimizations. Contributed
													to the design and
													implementation of new
													features used by millions of
													developers.
												</p>
												<div className="flex flex-wrap gap-2">
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														Angular
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														Go
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														GCP
													</Badge>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Experience 3 */}
								<div className="relative">
									<div className="flex flex-col md:flex-row items-center">
										<div className="flex md:w-1/2 md:justify-end mb-8 md:mb-0 md:pr-12">
											<div className="bg-card border border-border p-6 rounded-lg shadow-sm md:max-w-md w-full hover:border-primary transition-colors">
												<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2">
													2016 - 2018
												</Badge>
												<h3 className="text-xl font-bold mb-1">
													Frontend Developer
												</h3>
												<p className="text-muted-foreground mb-4">
													Airbnb
												</p>
												<p className="text-sm mb-4">
													Contributed to
													Airbnb&rsquo;s frontend
													architecture and component
													library. Worked on the
													booking flow and search
													experience, improving
													conversion rates and user
													satisfaction.
												</p>
												<div className="flex flex-wrap gap-2">
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														React
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														Redux
													</Badge>
													<Badge
														variant="outline"
														className="border-border text-muted-foreground"
													>
														Jest
													</Badge>
												</div>
											</div>
										</div>
										<div className="absolute left-0 md:left-1/2 top-8 md:top-12 w-8 h-8 rounded-full bg-primary flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-10">
											<div className="w-3 h-3 rounded-full bg-background"></div>
										</div>
										<div className="md:w-1/2 md:pl-12 md:pt-16">
											<ul className="space-y-2 text-sm">
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Redesigned the booking
														confirmation process
													</span>
												</li>
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Built reusable
														components for the
														design system
													</span>
												</li>
												<li className="flex items-start">
													<span className="text-primary mr-2">
														•
													</span>
													<span>
														Implemented
														comprehensive unit and
														integration tests
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Education Section */}
				<section id="education" className="py-20">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								Academic Background
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Education
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								My academic journey and qualifications that
								built the foundation for my career.
							</p>
						</div>

						<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Education Item 1 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2016 - 2018
										</Badge>
										<div className="text-sm text-muted-foreground">
											California, USA
										</div>
									</div>
									<h3 className="text-xl font-bold mb-1">
										MSc Software Engineering
									</h3>
									<p className="text-muted-foreground mb-4">
										Massachusetts Institute of Technology
									</p>
									<div className="flex items-center justify-between mb-4">
										<div className="text-sm">
											GPA: 3.95/4.0
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											With Honors
										</Badge>
									</div>
									<div className="pt-4 border-t border-border">
										<h4 className="font-medium mb-2 text-sm">
											Key Courses:
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Advanced Algorithms
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Distributed Systems
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Cloud Computing
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Education Item 2 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2012 - 2016
										</Badge>
										<div className="text-sm text-muted-foreground">
											California, USA
										</div>
									</div>
									<h3 className="text-xl font-bold mb-1">
										BSc Computer Science
									</h3>
									<p className="text-muted-foreground mb-4">
										Stanford University
									</p>
									<div className="flex items-center justify-between mb-4">
										<div className="text-sm">
											GPA: 3.8/4.0
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Dean&rsquo;s List
										</Badge>
									</div>
									<div className="pt-4 border-t border-border">
										<h4 className="font-medium mb-2 text-sm">
											Key Courses:
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Data Structures
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Web Development
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Database Systems
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Education Item 3 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2020
										</Badge>
										<div className="text-sm text-muted-foreground">
											Online
										</div>
									</div>
									<h3 className="text-xl font-bold mb-1">
										Advanced React Patterns
									</h3>
									<p className="text-muted-foreground mb-4">
										Frontend Masters
									</p>
									<div className="pt-4 border-t border-border">
										<h4 className="font-medium mb-2 text-sm">
											Topics Covered:
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Compound Components
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Render Props
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Custom Hooks
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Education Item 4 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2019
										</Badge>
										<div className="text-sm text-muted-foreground">
											Online
										</div>
									</div>
									<h3 className="text-xl font-bold mb-1">
										Cloud Architecture
									</h3>
									<p className="text-muted-foreground mb-4">
										AWS Training
									</p>
									<div className="pt-4 border-t border-border">
										<h4 className="font-medium mb-2 text-sm">
											Topics Covered:
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Serverless
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Microservices
											</Badge>
											<Badge
												variant="outline"
												className="border-border text-muted-foreground"
											>
												Infrastructure as Code
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Hackathons Section */}
				<section id="hackathons" className="py-20 bg-muted/30">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								Coding Competitions
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Hackathons
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								Competitions where I&rsquo;ve collaborated with
								teams to build innovative solutions under time
								constraints.
							</p>
						</div>

						<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Hackathon Item 1 */}
							<Card className="group bg-card border-border hover:border-primary hover:shadow-md transition-all overflow-hidden">
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src="/placeholder.svg?height=192&width=384"
										alt="Hackathon event"
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20"></div>
									<div className="absolute top-4 right-4">
										<Badge className="bg-primary text-primary-foreground">
											1st Place
										</Badge>
									</div>
									<div className="absolute bottom-4 left-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2023
										</Badge>
									</div>
								</div>
								<CardContent className="p-6">
									<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
										TechCrunch Disrupt Hackathon
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Built an AI-powered accessibility tool
										that converts speech to text in
										real-time for hearing-impaired users.
										Won first place among 120+ teams.
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											React
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											TensorFlow.js
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											WebRTC
										</Badge>
									</div>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<div className="flex items-center">
											<span className="mr-1">Team:</span>
											<span className="font-medium">
												4 members
											</span>
										</div>
										<div className="flex items-center">
											<span className="mr-1">
												Duration:
											</span>
											<span className="font-medium">
												48 hours
											</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Hackathon Item 2 */}
							<Card className="group bg-card border-border hover:border-primary hover:shadow-md transition-all overflow-hidden">
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src="/placeholder.svg?height=192&width=384"
										alt="Hackathon event"
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20"></div>
									<div className="absolute top-4 right-4">
										<Badge className="bg-primary/80 text-primary-foreground">
											2nd Place
										</Badge>
									</div>
									<div className="absolute bottom-4 left-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2022
										</Badge>
									</div>
								</div>
								<CardContent className="p-6">
									<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
										Google DevFest Hackathon
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Developed a sustainable living app that
										helps users track and reduce their
										carbon footprint through gamification
										and community challenges.
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Flutter
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Firebase
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Google Maps API
										</Badge>
									</div>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<div className="flex items-center">
											<span className="mr-1">Team:</span>
											<span className="font-medium">
												3 members
											</span>
										</div>
										<div className="flex items-center">
											<span className="mr-1">
												Duration:
											</span>
											<span className="font-medium">
												36 hours
											</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Hackathon Item 3 */}
							<Card className="group bg-card border-border hover:border-primary hover:shadow-md transition-all overflow-hidden">
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src="/placeholder.svg?height=192&width=384"
										alt="Hackathon event"
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20"></div>
									<div className="absolute top-4 right-4">
										<Badge className="bg-primary/60 text-primary-foreground">
											Finalist
										</Badge>
									</div>
									<div className="absolute bottom-4 left-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2021
										</Badge>
									</div>
								</div>
								<CardContent className="p-6">
									<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
										AWS Serverless Hackathon
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Created a serverless application for
										small businesses to manage inventory and
										sales with real-time analytics and low
										operational costs.
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											AWS Lambda
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											DynamoDB
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											React
										</Badge>
									</div>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<div className="flex items-center">
											<span className="mr-1">Team:</span>
											<span className="font-medium">
												2 members
											</span>
										</div>
										<div className="flex items-center">
											<span className="mr-1">
												Duration:
											</span>
											<span className="font-medium">
												24 hours
											</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Hackathon Item 4 */}
							<Card className="group bg-card border-border hover:border-primary hover:shadow-md transition-all overflow-hidden">
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src="/placeholder.svg?height=192&width=384"
										alt="Hackathon event"
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20"></div>
									<div className="absolute top-4 right-4">
										<Badge className="bg-primary text-primary-foreground">
											1st Place
										</Badge>
									</div>
									<div className="absolute bottom-4 left-4">
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2020
										</Badge>
									</div>
								</div>
								<CardContent className="p-6">
									<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
										Facebook Developer Circles Hackathon
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Built a mental health support platform
										that connects users with therapists and
										provides AI-powered mood tracking and
										personalized resources.
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											React Native
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Node.js
										</Badge>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											MongoDB
										</Badge>
									</div>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<div className="flex items-center">
											<span className="mr-1">Team:</span>
											<span className="font-medium">
												5 members
											</span>
										</div>
										<div className="flex items-center">
											<span className="mr-1">
												Duration:
											</span>
											<span className="font-medium">
												72 hours
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Certifications Section */}
				<section id="certifications" className="py-20">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								Professional Development
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Certifications
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								Professional certifications that validate my
								expertise and knowledge in various technologies.
							</p>
						</div>

						<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Certification Item 1 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2023
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										AWS Certified Solutions Architect
									</h3>
									<p className="text-muted-foreground mb-4">
										Amazon Web Services
									</p>
									<div className="text-sm text-muted-foreground">
										Comprehensive understanding of AWS
										architecture best practices, with
										expertise in designing and deploying
										scalable, highly available systems on
										AWS.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: AWS-ASA-12345
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Professional
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Certification Item 2 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
												<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
											</svg>
										</div>
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2022
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										Google Cloud Professional Developer
									</h3>
									<p className="text-muted-foreground mb-4">
										Google Cloud
									</p>
									<div className="text-sm text-muted-foreground">
										Expertise in designing, building, and
										managing applications on Google Cloud
										Platform, with a focus on scalability,
										reliability, and security.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: GCP-PD-67890
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Professional
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Certification Item 3 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
												<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
											</svg>
										</div>
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2022
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										Certified Kubernetes Administrator
									</h3>
									<p className="text-muted-foreground mb-4">
										Cloud Native Computing Foundation
									</p>
									<div className="text-sm text-muted-foreground">
										Proficiency in Kubernetes installation,
										configuration, and management, with
										skills in workload scheduling,
										networking, security, and
										troubleshooting.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: CKA-24680
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Professional
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Certification Item 4 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
												<rect
													x="2"
													y="3"
													width="20"
													height="14"
													rx="2"
													ry="2"
												></rect>
												<line
													x1="8"
													y1="21"
													x2="16"
													y2="21"
												></line>
												<line
													x1="12"
													y1="17"
													x2="12"
													y2="21"
												></line>
											</svg>
										</div>
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2021
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										Microsoft Certified: Azure Developer
										Associate
									</h3>
									<p className="text-muted-foreground mb-4">
										Microsoft
									</p>
									<div className="text-sm text-muted-foreground">
										Skills in developing solutions on
										Microsoft Azure, including compute,
										storage, security, and cloud integration
										services.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: AZ-204-13579
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Associate
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Certification Item 5 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
												<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
											</svg>
										</div>
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2020
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										Certified Scrum Master
									</h3>
									<p className="text-muted-foreground mb-4">
										Scrum Alliance
									</p>
									<div className="text-sm text-muted-foreground">
										Expertise in Scrum methodology,
										facilitating Scrum events, and coaching
										teams in Agile practices for effective
										product development.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: CSM-97531
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Professional
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Certification Item 6 */}
							<Card className="bg-card border-border hover:border-primary hover:shadow-md transition-all">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
												<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
												<line
													x1="16"
													y1="8"
													x2="2"
													y2="22"
												></line>
												<line
													x1="17.5"
													y1="15"
													x2="9"
													y2="15"
												></line>
											</svg>
										</div>
										<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
											2019
										</Badge>
									</div>
									<h3 className="text-lg font-bold mb-1">
										MongoDB Certified Developer
									</h3>
									<p className="text-muted-foreground mb-4">
										MongoDB, Inc.
									</p>
									<div className="text-sm text-muted-foreground">
										Proficiency in MongoDB database design,
										query optimization, indexing strategies,
										and application integration best
										practices.
									</div>
									<div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
										<div className="text-xs text-muted-foreground">
											Credential ID: MDB-DEV-86420
										</div>
										<Badge
											variant="outline"
											className="border-border text-muted-foreground"
										>
											Associate
										</Badge>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section id="contact" className="py-20 bg-muted/30">
					<div className="container mx-auto px-6">
						<div className="flex flex-col items-center text-center mb-12">
							<Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
								Get In Touch
							</Badge>
							<h2 className="text-4xl font-bold mb-6">
								Let&rsquo;s Work Together
							</h2>
							<div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
							<p className="text-muted-foreground text-lg max-w-2xl">
								Have a project in mind? Let&rsquo;s discuss how
								I can help bring your ideas to life.
							</p>
						</div>

						<div className="max-w-4xl mx-auto">
							<Card className="bg-card border-border overflow-hidden">
								<div className="grid grid-cols-1 md:grid-cols-2">
									<div className="p-8 bg-primary/5">
										<h3 className="text-xl font-bold mb-6">
											Contact Information
										</h3>
										<div className="space-y-6">
											<div>
												<p className="text-muted-foreground mb-1 text-sm">
													Email
												</p>
												<p className="font-medium">
													jordan@chendev.com
												</p>
											</div>
											<div>
												<p className="text-muted-foreground mb-1 text-sm">
													Location
												</p>
												<p className="font-medium">
													San Francisco, CA
												</p>
											</div>
											<div>
												<p className="text-muted-foreground mb-1 text-sm">
													Social Media
												</p>
												<div className="flex gap-3 mt-2">
													<Button
														variant="ghost"
														size="icon"
														className="rounded-full border border-border hover:border-primary hover:text-primary"
													>
														<Github className="h-4 w-4" />
														<span className="sr-only">
															GitHub
														</span>
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="rounded-full border border-border hover:border-primary hover:text-primary"
													>
														<Linkedin className="h-4 w-4" />
														<span className="sr-only">
															LinkedIn
														</span>
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="rounded-full border border-border hover:border-primary hover:text-primary"
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

									<div className="p-8">
										<h3 className="text-xl font-bold mb-6">
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
														className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
														className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
													className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
													className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												></textarea>
											</div>
											<Button className="w-full">
												Send Message
											</Button>
										</div>
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
									Jordan.dev
								</span>
							</div>
							<div className="text-sm text-muted-foreground">
								© 2025 Jordan Chen. All rights reserved.
							</div>
							<div className="flex gap-4">
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border hover:border-primary hover:text-primary"
								>
									<Github className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border hover:border-primary hover:text-primary"
								>
									<Linkedin className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full border border-border hover:border-primary hover:text-primary"
								>
									<Mail className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
