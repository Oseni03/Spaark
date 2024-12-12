import React from "react";
import {
	Html,
	Head,
	Body,
	Container,
	Heading,
	Text,
	Link,
} from "@react-email/components";

const ContactNotification = ({ name, email, message }) => {
	return (
		<Html>
			<Head />
			<Body
				style={{
					backgroundColor: "#f9f9f9",
					fontFamily: "Arial, sans-serif",
					padding: "20px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
						padding: "20px",
						maxWidth: "600px",
						margin: "0 auto",
					}}
				>
					<Heading
						style={{
							color: "#333333",
							fontSize: "24px",
							marginBottom: "20px",
						}}
					>
						New Contact Information
					</Heading>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						Hello,
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						You have received a new contact message. Here are the
						details:
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						<strong>Name:</strong> {name}
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						<strong>Email:</strong>{" "}
						<Link
							href={`mailto:${email}`}
							style={{ color: "#007BFF", textDecoration: "none" }}
						>
							{email}
						</Link>
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						<strong>Message:</strong>
					</Text>
					<Text
						style={{
							color: "#333333",
							fontSize: "16px",
							backgroundColor: "#f4f4f4",
							padding: "10px",
							borderRadius: "4px",
							lineHeight: "1.5",
						}}
					>
						{message}
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						Best regards,
					</Text>
					<Text
						style={{
							color: "#555555",
							fontSize: "16px",
							marginBottom: "15px",
						}}
					>
						Your Team
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

export default ContactNotification;
