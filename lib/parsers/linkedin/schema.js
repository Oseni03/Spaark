import { z } from "zod";

export const certificationSchema = z.object({
	Name: z.string(),
	Url: z.string().url(),
	Authority: z.string(),
	"Started On": z.string(),
	"Finished On": z.string().optional(),
	"License Number": z.string(),
});

export const educationSchema = z.object({
	"School Name": z.string(),
	"Start Date": z.string(),
	"End Date": z.string().optional(),
	Notes: z.string().optional(),
	"Degree Name": z.string(),
	Activities: z.string(),
});

export const emailSchema = z.object({
	"Email Address": z.string().email(),
	Confirmed: z.enum(["Yes", "No"]),
	Primary: z.enum(["Yes", "No"]),
	"Updated On": z.string(),
});

export const languageSchema = z.object({
	Name: z.string(),
	Proficiency: z.string().optional(),
});

export const positionSchema = z.object({
	"Company Name": z.string(),
	Title: z.string(),
	Description: z.string().optional(),
	Location: z.string(),
	"Started On": z.string(),
	"Finished On": z.string().optional(),
});

export const profileSchema = z.object({
	"First Name": z.string().default("John"),
	"Last Name": z.string().default("Doe"),
	"Maiden Name": z.string().optional(),
	Address: z.string().default("123 Example Street, Somewhere, USA"),
	"Birth Date": z.string().default("January 1st, 1970"),
	Headline: z.string().default(""),
	Summary: z.string().default(""),
	Industry: z.string().default(""),
	"Zip Code": z.string().optional(),
	"Geo Location": z.string().default("Somewhere"),
	"Twitter Handles": z.string().default("@test"),
	Websites: z.string().default("https://www.example.com"),
	"Instant Messengers": z.string().optional(),
});

export const projectSchema = z.object({
	Title: z.string(),
	Description: z.string(),
	Url: z.literal("").or(z.string().url()).optional(),
	"Started On": z.string(),
	"Finished On": z.string().optional(),
});

export const skillSchema = z.object({
	Name: z.string(),
});

export const linkedInSchema = z.object({
	Profile: z.array(profileSchema).optional(),
	"Email Addresses": z.array(emailSchema).optional(),
	Certifications: z.array(certificationSchema).optional(),
	Education: z.array(educationSchema).optional(),
	Languages: z.array(languageSchema).optional(),
	Positions: z.array(positionSchema).optional(),
	Projects: z.array(projectSchema).optional(),
	Skills: z.array(skillSchema).optional(),
});
