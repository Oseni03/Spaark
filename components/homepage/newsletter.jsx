"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { createSubscriber } from "@/services/newsletter";
import { Spinner } from "../ui/Spinner";

const Newsletter = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const response = await createSubscriber(email);

		if (response.success) {
			toast.success("Thank you for subscribing!");
			setEmail(""); // Reset the input field
		} else {
			toast.info(response.error);
		}
		setLoading(false);
		setEmail("");
	};

	return (
		<section className="container bg-gray-300 rounded-md">
			<div className="mx-auto my-10">
				<div className="flex flex-col items-center text-center text-black gap-6">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
						>
							<path
								opacity="0.2"
								d="M42 18L27.2719 28.5H20.7281L6 18L24 6L42 18Z"
								fill="#8B3DFF"
							/>
							<path
								d="M42.8325 16.7512L24.8325 4.75125C24.586 4.58679 24.2963 4.49902 24 4.49902C23.7037 4.49902 23.414 4.58679 23.1675 4.75125L5.1675 16.7512C4.96202 16.8883 4.79358 17.0741 4.67713 17.2919C4.56068 17.5098 4.49984 17.753 4.5 18V37.5C4.5 38.2956 4.81607 39.0587 5.37868 39.6213C5.94129 40.1839 6.70435 40.5 7.5 40.5H40.5C41.2957 40.5 42.0587 40.1839 42.6213 39.6213C43.1839 39.0587 43.5 38.2956 43.5 37.5V18C43.5002 17.753 43.4393 17.5098 43.3229 17.2919C43.2064 17.0741 43.038 16.8883 42.8325 16.7512ZM18.135 28.5L7.5 36V20.9119L18.135 28.5ZM21.2044 30H26.7956L37.4137 37.5H10.5862L21.2044 30ZM29.865 28.5L40.5 20.9119V36L29.865 28.5ZM24 7.80187L39.3581 18.0412L26.7956 27H21.2081L8.64563 18.0412L24 7.80187Z"
								fill="#8B3DFF"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-2xl font-bold">
							Subscribe to our newsletter
						</h2>
						<p className="text-gray-600">
							Enjoy using Block Template and stay tuned for the
							latest updates and news.
						</p>
					</div>
					<div className="w-full max-w-md">
						<form
							onSubmit={handleSubmit}
							className="flex flex-col md:flex-row gap-4"
						>
							<div className="w-full">
								<label
									htmlFor="notificationEmail"
									className="sr-only"
								>
									Email
								</label>
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Email"
									required
									className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
								/>
								<div className="text-sm text-red-600 hidden">
									Email is required.
								</div>
							</div>
							<div>
								<Button
									type="submit"
									name="subscribe"
									disabled={isLoading}
								>
									{isLoading && <Spinner />}
									Subscribe
								</Button>
							</div>
							{/* Anti-spam hidden field */}
							<div
								style={{
									position: "absolute",
									left: "-5000px",
								}}
								aria-hidden="true"
							>
								<Input
									className="subscription-form-antispam"
									type="text"
									name="b_b838b4eb099ebf09c3407db0f_b01fb647c7"
									tabIndex="-1"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Newsletter;
