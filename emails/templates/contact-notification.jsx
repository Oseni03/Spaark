import React from "react";
import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Text,
	Link,
} from "@react-email/components";
import { siteConfig } from "@/config/site";

const ContactNotification = ({ name, email, message }) => {
	return (
		<Html lang="en">
			<Head />
			<Preview>New contact form submission from {name}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section>
						<Text style={heading}>New Contact Form Submission</Text>
						<Text style={paragraph}>
							You have received a new message from your portfolio
							contact form.
						</Text>
						<Hr style={hr} />
						<Text style={paragraph}>
							<strong>Name:</strong> {name}
						</Text>
						<Text style={paragraph}>
							<strong>Email:</strong>{" "}
							<Link href={`mailto:${email}`} style={link}>
								{email}
							</Link>
						</Text>
						<Text style={paragraph}>
							<strong>Message:</strong>
						</Text>
						<Text style={messageBox}>{message}</Text>
						<Hr style={hr} />
						<Text style={paragraph}>Best regards,</Text>
						<Text style={paragraph}>{siteConfig.name}</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

const main = {
	backgroundColor: "#f9f9f9",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px",
	maxWidth: "580px",
	backgroundColor: "#ffffff",
	borderRadius: "8px",
	boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const heading = {
	fontSize: "24px",
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#333333",
	padding: "17px 0 0",
};

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#555555",
};

const messageBox = {
	padding: "15px",
	backgroundColor: "#f4f4f4",
	borderRadius: "4px",
	marginTop: "10px",
	whiteSpace: "pre-wrap",
	fontSize: "16px",
	lineHeight: "1.5",
	color: "#333333",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const link = {
	color: "#007BFF",
	textDecoration: "none",
};

export default ContactNotification;
