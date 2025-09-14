import * as React from "react";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
	Hr,
} from "@react-email/components";

const ConfirmEmailChange = ({ username, confirmUrl, userEmail, newEmail }) => {
	return (
		<Html lang="en" dir="ltr">
			<Head />
			<Preview>Confirm your email change for your Spaark account</Preview>
			<Tailwind>
				<Body className="bg-white font-sans py-[40px]">
					<Container className="bg-white mx-auto px-[20px] max-w-[580px]">
						{/* Logo */}
						<Section className="text-center mb-[32px]">
							<Img
								src="https://spaark.dev/icon.png"
								width="64"
								height="64"
								alt="Spaark"
								className="mx-auto"
							/>
						</Section>

						{/* Main Content */}
						<Section>
							<Heading className="text-[#020304] text-[24px] font-bold text-center mb-[24px] mt-0">
								Hey {username}, let&rsquo;s confirm your new
								email! 🎯
							</Heading>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[16px]">
								We received a request to change your email
								address from <strong>{userEmail}</strong> to{" "}
								<strong>{newEmail}</strong>.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[24px]">
								To keep your developer portfolio secure and
								ensure you don&rsquo;t miss any important
								updates about your projects, we need you to
								confirm this change.
							</Text>

							{/* Confirmation Button */}
							<Section className="text-center mb-[32px]">
								<Button
									href={confirmUrl}
									className="bg-[#010101] text-white text-[16px] font-semibold py-[12px] px-[24px] rounded-[8px] no-underline box-border inline-block"
								>
									Confirm Email Change
								</Button>
							</Section>

							<Text className="text-[#020304] text-[14px] leading-[20px] mb-[16px]">
								If the button doesn&rsquo;t work, you can also
								copy and paste this link into your browser:
							</Text>

							<Text className="text-[#010101] text-[14px] leading-[20px] mb-[24px] break-all">
								<Link
									href={confirmUrl}
									className="text-[#010101] underline"
								>
									{confirmUrl}
								</Link>
							</Text>

							<Hr className="border-gray-200 my-[24px]" />

							<Text className="text-[#020304] text-[14px] leading-[20px] mb-[16px]">
								<strong>Important:</strong> This confirmation
								link will expire in 24 hours for security
								reasons.
							</Text>

							<Text className="text-[#020304] text-[14px] leading-[20px] mb-[24px]">
								If you didn&rsquo;t request this email change,
								please ignore this message or contact our
								support team. Your current email address will
								remain unchanged.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[8px]">
								Happy coding! 🚀
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[32px]">
								The Spaark Team
							</Text>
						</Section>

						{/* Footer */}
						<Hr className="border-gray-200 my-[32px]" />

						<Section className="text-center">
							<Text className="text-gray-500 text-[12px] leading-[16px] mb-[8px]">
								<Link
									href="https://spaark.dev"
									className="text-gray-500 no-underline"
								>
									Home
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev/pricing"
									className="text-gray-500 no-underline"
								>
									{" "}
									Pricing
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev/privacy"
									className="text-gray-500 no-underline"
								>
									{" "}
									Privacy
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev/terms"
									className="text-gray-500 no-underline"
								>
									{" "}
									Terms
								</Link>
							</Text>

							<Text className="text-gray-500 text-[12px] leading-[16px] m-0">
								© 2025 Spaark. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ConfirmEmailChange;
