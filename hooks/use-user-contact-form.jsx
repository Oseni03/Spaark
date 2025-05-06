"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import { useParams } from "next/navigation";

const INITIAL_FORM_STATE = {
	email: "",
	subject: "",
	full_name: "",
	message: "",
};

export const useUserContactForm = () => {
	const { subdomain } = useParams();
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = useCallback(() => {
		const newErrors = {};

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Full name validation
		if (!formData.full_name.trim()) {
			newErrors.full_name = "Full name is required";
		} else if (formData.full_name.length < 2) {
			newErrors.full_name = "Name must be at least 2 characters long";
		}

		// Subject validation
		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		} else if (formData.subject.length < 3) {
			newErrors.subject = "Subject must be at least 3 characters long";
		}

		// Message validation
		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		} else if (formData.message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters long";
		} else if (formData.message.length > 1000) {
			newErrors.message = "Message must not exceed 1000 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, setErrors]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));

			// Clear error when user starts typing
			if (errors[name]) {
				setErrors((prev) => ({
					...prev,
					[name]: "",
				}));
			}
		},
		[errors, setErrors, setFormData]
	);

	const resetForm = useCallback(() => {
		setFormData(INITIAL_FORM_STATE);
		setErrors({});
	}, [setErrors, setFormData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm() || isSubmitting) return;

		setIsSubmitting(true);
		logger.info("User contact form submission attempt", {
			email: formData.email,
			name: formData.full_name,
		});

		try {
			if (!subdomain) {
				throw new Error("Can't send contact email from builder page");
			}
			const response = await fetch("/api/send-user-contact-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subdomain,
					subject: formData.subject,
					props: {
						subject: formData.subject,
						name: formData.full_name,
						email: formData.email,
						message: formData.message,
					},
				}),
			});

			const { success, error } = await response.json();

			if (success) {
				toast.success("Message sent successfully!");
				resetForm();
				logger.info("Contact form submitted successfully");
			} else {
				toast.error(error || "Failed to send message");
			}
		} catch (error) {
			logger.error("Contact form submission failed", {
				error,
				email: formData.email,
			});

			toast.error(
				error instanceof Error
					? error.message
					: "Error sending message. Please try again later."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		formData,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
		resetForm,
	};
};
