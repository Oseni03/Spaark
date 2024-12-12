import { saveContact } from "@/services/contact";
import { toast } from "sonner";
import { ContactForm } from "./components/contact-form";
import FormWrapper from "@/components/wrapper/form-wrapper";

const Page = () => {
	const handleContact = async ({ email, full_name, message }) => {
		if (!email || !full_name || !message) {
			throw new Error("All fields are required.");
		}

		const response = await saveContact({ email, full_name, message });

		if (response.success) {
			toast.success("Will get back to you soon.");
		} else {
			console.log(response);
			toast.error("Error sending message. Try again later");
		}
	};

	return (
		<FormWrapper
			title={"Contact us for anything"}
			description={"Our goal is to be as helpful as possible."}
		>
			<ContactForm formHandler={handleContact} />
		</FormWrapper>
	);
};

export default Page;
