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

const MagicLinkEmail = ({ url }) => {
	return (
		<Html lang="en" dir="ltr">
			<Head />
			<Preview>
				Your magic link is ready! ✨ Click to access your Spaark account
			</Preview>
			<Tailwind>
				<Body className="bg-[#FFFFFF] font-sans py-[40px]">
					<Container className="bg-[#ffffff] mx-auto px-[20px] max-w-[580px]">
						{/* Header with Logo */}
						<Section className="text-center mb-[32px]">
							<Img
								src="https://spaark.dev/icon.png"
								width="64"
								height="64"
								alt="Spaark"
								className="mx-auto mb-[16px]"
							/>
							<Heading className="text-[#020304] text-[28px] font-bold leading-[1.3] mt-0 mb-0">
								Your Magic Link is Here! ✨
							</Heading>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="text-[#020304] text-[16px] leading-[1.6] mt-0 mb-[16px]">
								Hey there, developer! 👋
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[1.6] mt-0 mb-[24px]">
								Ready to dive into your Spaark portfolio?
								We&rsquo;ve conjured up a secure magic link just
								for you. No passwords, no hassle – just pure
								coding magic! 🎩✨
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[1.6] mt-0 mb-[32px]">
								Click the button below to access your account
								and continue building your amazing developer
								portfolio:
							</Text>

							{/* Magic Link Button */}
							<Section className="text-center mb-[32px]">
								<Button
									href={url}
									className="bg-[#010101] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
								>
									Access My Account 🚀
								</Button>
							</Section>

							<Text className="text-[#020304] text-[14px] leading-[1.6] mt-0 mb-[24px]">
								<strong>Security note:</strong> This link is
								valid for 15 minutes and can only be used once.
								If you didn&rsquo;t request this login, you can
								safely ignore this email.
							</Text>

							<Text className="text-[#020304] text-[16px] leading-[1.6] mt-0 mb-[16px]">
								Having trouble with the button? Copy and paste
								this link into your browser:
							</Text>

							<Text className="text-[#020304] text-[14px] leading-[1.6] mt-0 mb-[32px] break-all">
								<Link
									href={url}
									className="text-[#010101] underline"
								>
									{url}
								</Link>
							</Text>
						</Section>

						{/* Call to Action */}
						<Section className="bg-[#f8f9fa] rounded-[8px] p-[24px] mb-[32px]">
							<Text className="text-[#020304] text-[16px] leading-[1.6] mt-0 mb-[16px] font-semibold">
								🎯 Ready to showcase your skills?
							</Text>
							<Text className="text-[#020304] text-[14px] leading-[1.6] mt-0 mb-0">
								Once you&rsquo;re in, explore our latest
								features for building stunning developer
								portfolios that actually land you jobs. Your
								code deserves a stage that shines! ⭐
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-t border-solid border-[#e5e7eb] pt-[24px] mt-[40px]">
							<Text className="text-[#6b7280] text-[12px] leading-[1.5] text-center mt-0 mb-[12px]">
								<Link
									href="https://spaark.dev"
									className="text-[#010101] no-underline"
								>
									Home
								</Link>
								{" • "}
								<Link
									href="https://spaark.dev/pricing"
									className="text-[#010101] no-underline"
								>
									Pricing
								</Link>
								{" • "}
								<Link
									href="https://spaark.dev/privacy"
									className="text-[#010101] no-underline"
								>
									Privacy
								</Link>
								{" • "}
								<Link
									href="https://spaark.dev/terms"
									className="text-[#010101] no-underline"
								>
									Terms
								</Link>
							</Text>

							<Text className="text-[#6b7280] text-[12px] leading-[1.5] text-center mt-0 mb-[8px]">
								© 2025 Spaark. All rights reserved.
							</Text>

							<Text className="text-[#6b7280] text-[12px] leading-[1.5] text-center mt-0 mb-0">
								<Link
									href="https://spaark.dev/unsubscribe"
									className="text-[#6b7280] underline"
								>
									Unsubscribe
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default MagicLinkEmail;
