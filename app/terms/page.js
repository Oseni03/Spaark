import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { siteConfig } from "@/config/site";

function Page() {
	return (
		<PageWrapper>
			<div className="min-h-screen flex flex-col items-center py-10 px-4">
				<div className="max-w-4xl shadow-md rounded-lg p-6 md:p-10">
					<h1 className="text-4xl font-bold text-center mb-6">
						Terms of Use
					</h1>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Acceptance of Terms
						</h2>
						<p>
							By accessing or using <b>{siteConfig.name}</b>, you
							agree to be bound by these Terms of Use. If you do
							not agree to these terms, you may not use the
							Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. Eligibility
						</h2>
						<p>
							You must be at least 18 years old to use the
							Service. By using the Service, you represent and
							warrant that you meet this eligibility requirement.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. User Accounts
						</h2>
						<p>
							To access certain features, you may be required to
							create an account. You agree to provide accurate,
							complete, and updated information for your account
							and are responsible for maintaining the
							confidentiality of your login credentials.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							4. Prohibited Activities
						</h2>
						<p className="mb-4">
							You agree not to engage in any of the following
							prohibited activities:
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>Using the Service for illegal purposes.</li>
							<li>
								Attempting to access unauthorized areas of the
								Service.
							</li>
							<li>Uploading malicious code or viruses.</li>
							<li>
								Exploiting the Service for personal or
								commercial gain without authorization.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							5. Payment Terms
						</h2>
						<p>
							If you purchase a subscription or any other
							services, you agree to pay all applicable fees in
							accordance with the terms outlined at the time of
							purchase. Payments are non-refundable unless
							required by law.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							6. Intellectual Property
						</h2>
						<p>
							All content, trademarks, and other intellectual
							property on the Service are owned by{" "}
							<b>{siteConfig.name}</b> or its licensors. You may
							not reproduce, distribute, or otherwise exploit
							these materials without prior written permission.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							7. Limitation of Liability
						</h2>
						<p>
							To the maximum extent permitted by law,{" "}
							<b>{siteConfig.name}</b> is not liable for any
							indirect, incidental, or consequential damages
							arising from your use of the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							8. Termination
						</h2>
						<p>
							We may terminate or suspend your access to the
							Service at any time if you violate these Terms of
							Use or for any other reason at our discretion.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							9. Governing Law
						</h2>
						<p>
							These Terms of Use shall be governed by and
							construed in accordance with the laws of the
							jurisdiction where <b>{siteConfig.name}</b> is
							registered.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							10. Contact Us
						</h2>
						<p>
							For questions or concerns about these Terms of Use,
							please{" "}
							<Link href="/contact-us">
								<Button size="sm">
									contact us{" "}
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</p>
					</section>
				</div>
			</div>
		</PageWrapper>
	);
}

export default Page;
