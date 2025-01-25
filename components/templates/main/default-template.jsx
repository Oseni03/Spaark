import { HackathonCard } from "./_components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "./_components/project-card";
import { ResumeCard } from "./_components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { Globe } from "lucide-react";
import HTMLReactParser from "html-react-parser";
import ContactCard from "./_components/contact-card";
import { CertificationCard } from "./_components/certification-card";
import Image from "next/image";

const BLUR_FADE_DELAY = 0.04;

export default function DefaultTemplate({
	basics,
	experiences,
	educations,
	skills,
	projects,
	hackathons,
	certifications,
}) {
	return (
		<main className="flex flex-col min-h-[100dvh] space-y-10 overflow-auto scrollbar-hide">
			<section id="hero">
				<div className="mx-auto w-full max-w-2xl space-y-8">
					<div className="gap-2 flex justify-between">
						<div className="flex-col flex flex-1 space-y-1.5">
							<BlurFadeText
								delay={BLUR_FADE_DELAY}
								className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
								yOffset={8}
								text={`Hi, I'm ${basics?.name?.split(" ")[0]} 👋`}
							/>
							<BlurFadeText
								className="max-w-[600px] md:text-xl"
								delay={BLUR_FADE_DELAY}
								text={HTMLReactParser(basics?.summary)}
							/>
						</div>
						<BlurFade delay={BLUR_FADE_DELAY}>
							<Avatar className="size-28 border">
								<AvatarImage
									alt={basics?.name}
									src={basics?.picture}
								/>
								<AvatarFallback>
									{getInitials(basics?.name)}
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
		</main>
	);
}
