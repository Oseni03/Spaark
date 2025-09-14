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
} from "@react-email/components";

const ConfirmAccountDelete = ({ username, confirmUrl, email }) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>
					Confirm your Spaark account deletion - We&rsquo;re sad to
					see you go!
				</Preview>
				<Body className="bg-white font-sans py-[40px]">
					<Container className="bg-white max-w-[600px] mx-auto px-[20px]">
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
							<Heading className="text-[#020304] text-[28px] font-bold text-center mb-[24px] mt-0">
								Account Deletion Confirmation
							</Heading>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[20px] mt-0">
								Hey {username} 👋
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[20px] mt-0">
								We received a request to delete your Spaark
								account ({email}). While we&rsquo;re sad to see
								you go, we respect your decision and want to
								make this process as smooth as possible.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[24px] mt-0">
								<strong>⚠️ Important:</strong> This action is
								permanent and cannot be undone. Once confirmed,
								all your portfolio data, projects, and account
								information will be permanently deleted from our
								servers.
							</Text>

							{/* Confirmation Button */}
							<Section className="text-center mb-[32px]">
								<Button
									href={confirmUrl}
									className="bg-[#010101] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-medium no-underline box-border inline-block"
								>
									Confirm Account Deletion
								</Button>
							</Section>

							<Text className="text-[14px] leading-[20px] mb-[20px] mt-0 text-center text-gray-600">
								This confirmation link will expire in 24 hours
								for security reasons.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[20px] mt-0">
								<strong>Changed your mind?</strong> Simply
								ignore this email and your account will remain
								active. No further action is needed.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[24px] mt-0">
								If you&rsquo;re leaving because something
								wasn&rsquo;t working right or you had a bad
								experience, we&rsquo;d love to hear about it.
								Your feedback helps us improve Spaark for
								everyone. Feel free to reply to this email with
								your thoughts.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[32px] mt-0">
								Thanks for being part of the Spaark community.
								We hope to see you again someday! 🚀
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[24px] mb-[0px] mt-0">
								Best regards,
								<br />
								The Spaark Team
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-t border-solid border-gray-200 pt-[32px] mt-[48px]">
							<Text className="text-[#020304] text-[14px] leading-[20px] text-center mb-[16px] mt-0">
								<Link
									href="https://spaark.dev"
									className="text-[#010101] no-underline"
								>
									Home
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev#pricing"
									className="text-[#010101] no-underline"
								>
									{" "}
									Pricing
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev/privacy"
									className="text-[#010101] no-underline"
								>
									{" "}
									Privacy
								</Link>{" "}
								•
								<Link
									href="https://spaark.dev/terms"
									className="text-[#010101] no-underline"
								>
									{" "}
									Terms
								</Link>
							</Text>

							<Text className="text-gray-500 text-[12px] leading-[16px] text-center m-0">
								© 2025 Spaark. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ConfirmAccountDelete;
