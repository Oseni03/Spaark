"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ContactForm } from "@/app/contact-us/components/contact-form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import ContactNotification from "@/emails/templates/contact-notification";

export default function ContactCard() {
	const { subdomain } = useParams();

	const onSubmit = async ({ name, email, message }) => {
		try {
			const templateMessage = (
				<ContactNotification
					name={name}
					email={email}
					message={message}
				/>
			);

			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: subdomain,
					subject: "New contact message",
					reactTemplate: templateMessage,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Message sent successfully!");
			} else {
				toast.error(result.error || "Failed to send message");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		}
	};
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
						<ContactForm formHandler={onSubmit} />
					</CardItem>
				</div>
			</CardBody>
		</CardContainer>
	);
}
