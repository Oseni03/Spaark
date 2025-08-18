import { ContactForm } from "@/components/forms/contact-form";
import FormWrapper from "@/components/forms/form-wrapper";

const Page = () => {
	return (
		<FormWrapper
			title={"Contact us for anything"}
			description={"Our goal is to be as helpful as possible."}
		>
			<ContactForm />
		</FormWrapper>
	);
};

export default Page;
