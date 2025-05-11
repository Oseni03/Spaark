import { createId } from "@paralleldrive/cuid2";

// Sample portfolio data based on the provided schema
const samplePortfolio = {
	id: createId(),
	name: "Alex Chen - Full Stack Developer",
	slug: "alex-chen-dev",
	isLive: true,
	blogEnabled: true,
	template: "modern",
	customDomain: "alexchen.dev",

	// Basics section
	basics: {
		name: "About Me",
		visible: true,
		name: "Alex Chen",
		headline: "Full Stack Developer with 5+ years experience",
		email: "alex.chen@example.com",
		phone: "+1 (555) 123-4567",
		location: "San Francisco, CA",
		years: 5,
		picture:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
		summary:
			"Passionate full stack developer with expertise in React, Node.js, and cloud architecture.",
		about: "I'm a software engineer with a focus on creating scalable web applications. With over 5 years of industry experience, I've worked on projects ranging from small startups to enterprise-level applications. I'm passionate about clean code, user experience, and continuous learning.",
	},

	// Certifications section
	certifications: {
		id: "certification",
		name: "Certifications",
		visible: true,
		items: [
			{
				visible: true,
				name: "AWS Certified Solutions Architect",
				issuer: "Amazon Web Services",
				date: "2023-06",
				summary:
					"Comprehensive certification validating expertise in designing distributed systems on AWS.",
				url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
			},
			{
				visible: true,
				name: "MongoDB Certified Developer",
				issuer: "MongoDB University",
				date: "2022-11",
				summary:
					"Advanced certification in MongoDB database development and administration.",
				url: "https://university.mongodb.com/certification",
			},
		],
	},

	// Education section
	educations: {
		id: "education",
		name: "Education",
		visible: true,
		items: [
			{
				visible: true,
				institution: "University of California, Berkeley",
				studyType: "Bachelor of Science in Computer Science",
				date: "2015-2019",
				summary:
					"Graduated with honors. Specialized in distributed systems and machine learning.",
				logo: "https://www.berkeley.edu/images/berkeley-logo.png",
				url: "https://www.berkeley.edu",
				location: "Berkeley, CA",
			},
			{
				visible: true,
				institution: "Udacity",
				studyType: "Nanodegree in React Development",
				date: "2020",
				summary:
					"Intensive program covering advanced React concepts and state management.",
				logo: "https://d20vrrgs8k4bvw.cloudfront.net/images/logo.png",
				url: "https://www.udacity.com",
				location: "",
			},
		],
	},

	// Experiences section
	experiences: {
		id: "experience",
		name: "Work Experience",
		visible: true,
		items: [
			{
				visible: true,
				company: "TechNova Inc.",
				position: "Senior Full Stack Developer",
				location: "San Francisco, CA",
				date: "2021-Present",
				summary:
					"Leading development of the company's flagship SaaS platform. Implemented microservices architecture that improved system reliability by 40%. Mentored junior developers and established code review practices.",
				picture: "https://logo.clearbit.com/technova.com",
				url: "https://www.technova-example.com",
				technologies: ["React", "Node.js", "GraphQL", "AWS", "Docker"],
			},
			{
				visible: true,
				company: "DataStream Solutions",
				position: "Full Stack Developer",
				location: "Remote",
				date: "2019-2021",
				summary:
					"Developed and maintained multiple client-facing web applications. Reduced page load times by 60% through code optimization and improved caching strategies.",
				picture: "https://logo.clearbit.com/datastream.com",
				url: "https://www.datastream-example.com",
				technologies: [
					"JavaScript",
					"React",
					"Express",
					"MongoDB",
					"Redis",
				],
			},
		],
	},

	// Hackathons section
	hackathons: {
		id: "hackathon",
		name: "Hackathons",
		visible: true,
		items: [
			{
				visible: true,
				name: "SF Tech Hack 2023",
				location: "San Francisco, CA",
				description:
					"First place winner. Developed a real-time accessibility checker tool for websites using AI.",
				date: "2023-03",
				logo: "https://sftechhack.com/logo.png",
				links: [
					{
						id: createId(),
						label: "Project Demo",
						url: "https://devpost.com/software/accessibility-ai",
						icon: "play-circle",
					},
					{
						id: createId(),
						label: "GitHub Repository",
						url: "https://github.com/alex-chen/accessibility-ai",
						icon: "github",
					},
				],
				technologies: ["React", "TensorFlow.js", "Node.js"],
			},
			{
				visible: true,
				name: "Global AI Hackathon",
				location: "Virtual",
				description:
					"Built a natural language financial advisor that simplifies complex financial concepts.",
				date: "2022-10",
				logo: "https://globalai-hackathon.com/logo.png",
				links: [
					{
						id: createId(),
						label: "Project Page",
						url: "https://devpost.com/software/finance-explainer",
						icon: "link",
					},
				],
				technologies: ["Python", "OpenAI API", "Flask", "Vue.js"],
			},
		],
	},

	// Socials section
	socials: {
		id: "social",
		name: "Socials",
		visible: true,
		items: [
			{
				visible: true,
				network: "GitHub",
				username: "alex-chen-dev",
			},
			{
				visible: true,
				network: "LinkedIn",
				username: "alexchendev",
			},
			{
				visible: true,
				network: "Twitter",
				username: "@alexchendev",
			},
		],
	},

	// Projects section
	projects: {
		id: "project",
		name: "Projects",
		visible: true,
		items: [
			{
				visible: true,
				name: "EcoTrack",
				description:
					"A mobile app that helps users track and reduce their carbon footprint by providing personalized recommendations and community challenges.",
				date: "2023",
				technologies: [
					"React Native",
					"Firebase",
					"Node.js",
					"Express",
					"MongoDB",
				],
				website: "https://ecotrack-app.com",
				source: "https://github.com/alex-chen/ecotrack",
				image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=500",
				video: "https://www.youtube.com/watch?v=abc123",
				type: "Mobile App",
			},
			{
				visible: true,
				name: "DevCollab",
				description:
					"A collaborative platform for developers to find teammates and work on open-source projects together. Features include project matching, skill assessments, and integrated project management.",
				date: "2022",
				technologies: ["React", "GraphQL", "Apollo", "Postgres", "AWS"],
				website: "https://devcollab.io",
				source: "https://github.com/alex-chen/devcollab",
				image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500",
				video: null,
				type: "Web Application",
			},
			{
				visible: true,
				name: "ChatTranslate",
				description:
					"A browser extension that provides real-time translation for chat applications, supporting over 50 languages with offline capabilities.",
				date: "2021",
				technologies: [
					"JavaScript",
					"WebExtension API",
					"TensorFlow.js",
				],
				website: "https://chattranslate.io",
				source: "https://github.com/alex-chen/chat-translate",
				image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500",
				video: null,
				type: "Browser Extension",
			},
		],
	},

	// Skills section
	skills: {
		id: "skill",
		name: "Skills",
		visible: true,
		items: [
			{
				visible: true,
				name: "React",
				description:
					"Building complex, performant user interfaces with React hooks, context API, and custom components.",
				level: "Expert",
			},
			{
				visible: true,
				name: "Node.js",
				description:
					"Creating scalable backend services with Express, authentication, and database integration.",
				level: "Expert",
			},
			{
				visible: true,
				name: "GraphQL",
				description:
					"Designing efficient APIs with Apollo Server and client integration.",
				level: "Advanced",
			},
			{
				visible: true,
				name: "AWS",
				description:
					"Deploying and managing applications on EC2, S3, Lambda, and using various AWS services.",
				level: "Advanced",
			},
			{
				visible: true,
				name: "TypeScript",
				description:
					"Writing type-safe code for both frontend and backend applications.",
				level: "Advanced",
			},
			{
				visible: true,
				name: "Docker",
				description:
					"Containerizing applications and managing deployments with Docker Compose.",
				level: "Intermediate",
			},
			{
				visible: true,
				name: "MongoDB",
				description:
					"Designing schemas, optimizing queries, and implementing data aggregation pipelines.",
				level: "Advanced",
			},
			{
				visible: true,
				name: "CI/CD",
				description:
					"Setting up automated testing and deployment pipelines with GitHub Actions and Jenkins.",
				level: "Intermediate",
			},
		],
	},
};

export default samplePortfolio;
