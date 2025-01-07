"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import { getUserByEmail } from "@/services/user";
import { activateUserCode } from "@/services/code";

const INITIAL_FORM_STATE = {
	email: "",
	code: "",
};

export const useCodeActivation = () => {
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

		// Code validation
		if (!formData.code.trim()) {
			newErrors.code = "Code is required";
		} else if (formData.code.length < 4) {
			newErrors.code = "Code must be at least 4 characters long";
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
		logger.info("Code activation submission attempt", {
			email: formData.email,
			code: formData.code,
		});

		try {
			const user = await getUserByEmail(formData.email);

			if (!user.success) {
				toast.error("User does not exist!");
				throw new Error(user.error || "User does not exist");
			}

			const userCode = await activateUserCode(
				formData.code,
				user.data.id
			);

			if (!userCode.success) {
				logger.error("Invalid code: ", formData.code);
			} else {
				logger.info("Code activation successful");
			}

			toast.success("Code activated!");
			resetForm();
		} catch (error) {
			logger.error("Code activation failed", {
				error,
				email: formData.email,
				code: formData.code,
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
	};
};
