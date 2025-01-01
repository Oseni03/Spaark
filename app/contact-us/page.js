"use client";
import { ContactForm } from "./components/contact-form";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useContactForm } from "@/hooks/use-contact-form";

const Page = () => {
	const { formData, errors, isSubmitting, handleChange, handleSubmit } =
		useContactForm();

	return (
		<FormWrapper
			title={"Contact us for anything"}
			description={"Our goal is to be as helpful as possible."}
		>
			<ContactForm
				formData={formData}
				errors={errors}
				isSubmitting={isSubmitting}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</FormWrapper>
	);
};

export default Page;
