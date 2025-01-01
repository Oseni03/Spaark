import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ContactForm = ({
	formData,
	errors,
	isSubmitting,
	handleChange,
	handleSubmit,
}) => {
	return (
		<form onSubmit={handleSubmit} className="grid space-y-3">
			<div className="space-y-2">
				<Label>Email</Label>
				<Input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className={errors.email ? "border-red-500" : ""}
				/>
				{errors.email && <p className="text-red-500">{errors.email}</p>}
			</div>

			<div className="space-y-2">
				<Label>Full Name</Label>
				<Input
					type="text"
					name="full_name"
					value={formData.full_name}
					onChange={handleChange}
					className={errors.full_name ? "border-red-500" : ""}
				/>
				{errors.full_name && (
					<p className="text-red-500">{errors.full_name}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label>Your Message</Label>
				<Textarea
					name="message"
					value={formData.message}
					onChange={handleChange}
					placeholder="Your message"
					className={errors.message ? "border-red-500" : ""}
					rows={4}
				/>
				{errors.message && (
					<p className="text-red-500">{errors.message}</p>
				)}
			</div>

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting && <Spinner />}
				{isSubmitting ? "Sending..." : "Send Message"}
			</Button>
		</form>
	);
};
