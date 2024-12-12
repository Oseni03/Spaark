"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { ContactForm } from "@/app/contact-us/components/contact-form";

export default function ContactCard() {
	const handleContact = async ({ email, full_name, message }) => {
		if (!email || !full_name || !message) {
			throw new Error("All fields are required.");
		}

		toast.success("Will get back to you soon.");
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
						<ContactForm formHandler={handleContact} />
					</CardItem>
				</div>
			</CardBody>
		</CardContainer>
	);
}
