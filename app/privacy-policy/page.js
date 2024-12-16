import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
	return (
		<PageWrapper>
			<div className="min-h-screen flex flex-col items-center py-10 px-4">
				<div className="max-w-4xl rounded-lg p-6 md:p-10">
					<h1 className="text-4xl font-bold text-center mb-6">
						Privacy Policy
					</h1>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Information We Collect
						</h2>
						<p className="mb-4">
							We collect the following types of information to
							provide our services and improve your experience:
						</p>
						<div className="mb-4">
							<h3 className="text-xl font-medium">
								1.1. Information You Provide
							</h3>
							<ul className="list-disc list-inside">
								<li>
									Account Information: name, email, payment
									details.
								</li>
								<li>
									Usage Information: activity data,
									subscriptions, and preferences.
								</li>
							</ul>
						</div>
						<div className="mb-4">
							<h3 className="text-xl font-medium">
								1.2. Automatically Collected Information
							</h3>
							<ul className="list-disc list-inside">
								<li>
									Device Information: IP address, browser
									type, and device identifiers.
								</li>
								<li>
									Usage Data: interaction metrics like page
									views and feature use.
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-xl font-medium">
								1.3. Third-Party Information
							</h3>
							<p>
								Data from integrated services like Google or
								payment providers.
							</p>
						</div>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. How We Use Your Information
						</h2>
						<p>Your information is used to:</p>
						<ul className="list-disc list-inside space-y-2">
							<li>
								Provide, maintain, and improve our services.
							</li>
							<li>Process payments and manage subscriptions.</li>
							<li>
								Send emails, updates, and promotional content
								(if consented).
							</li>
							<li>
								Analyze behavior to enhance user experience.
							</li>
							<li>
								Comply with legal obligations and prevent
								misuse.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. Sharing Your Information
						</h2>
						<p>
							We share your data only in the following situations:
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>
								With service providers for payments, analytics,
								and data storage.
							</li>
							<li>
								For legal compliance or to protect the
								platform&apos;s integrity.
							</li>
							<li>
								During business transfers, such as mergers or
								acquisitions.
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							4. Data Retention
						</h2>
						<p>
							Your data is retained as long as your account is
							active or necessary for legal and operational
							purposes. Upon termination, data is deleted or
							anonymized.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							5. Your Privacy Rights
						</h2>
						<p>You can:</p>
						<ul className="list-disc list-inside space-y-2">
							<li>Request access to your data.</li>
							<li>Update or correct your information.</li>
							<li>Request deletion of your data.</li>
							<li>Opt out of promotional communications.</li>
						</ul>
						<p className="mt-4">
							To exercise these rights,{" "}
							<Link href="/contact-us">
								<Button size="sm">
									contact us{" "}
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							6. Security Measures
						</h2>
						<p>
							We use encryption, secure servers, and regular
							audits to protect your data. However, no system can
							guarantee 100% security. Please keep your passwords
							safe.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							7. Contact Us
						</h2>
						<p>
							If you have any questions about this Privacy Policy,{" "}
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
