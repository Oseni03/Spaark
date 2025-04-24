"use client";

import { useEffect, useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

export default function EmailLinkHandler() {
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		async function handleEmailLink() {
			// Check if the current URL is a sign-in link
			if (isSignInWithEmailLink(auth, window.location.href)) {
				let email = window.localStorage.getItem("emailForSignIn");

				// If email is missing, prompt the user for it
				if (!email) {
					email = window.prompt(
						"Please provide your email for confirmation"
					);
				}

				if (email) {
					try {
						// Sign in the user with the email link
						const result = await signInWithEmailLink(
							auth,
							email,
							window.location.href
						);

						// Clear the email from localStorage
						window.localStorage.removeItem("emailForSignIn");

						logger.info("Email link sign in successful", {
							uid: result.user.uid,
							email: result.user.email,
						});

						toast.success("Successfully signed in!");

						// Redirect to the dashboard or home page
						router.push("/dashboard");
					} catch (error) {
						logger.error(
							"Email link authentication failed:",
							error
						);
						setError(
							"Failed to sign in with the email link. It may have expired or already been used."
						);
						toast.error("Authentication failed", {
							description:
								"There was a problem signing you in with this link.",
						});
					}
				} else {
					setError("No email provided for authentication.");
				}
			} else {
				setError("This is not a valid sign-in link.");
			}

			setIsProcessing(false);
		}

		handleEmailLink();
	}, [router]);

	if (isProcessing) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h2 className="text-xl font-medium mb-2">
						Processing your sign-in...
					</h2>
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
					<h2 className="text-xl font-medium text-red-600 mb-2">
						Authentication Error
					</h2>
					<p className="mb-4">{error}</p>
					<button
						onClick={() => router.push("/")}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Return to Sign In
					</button>
				</div>
			</div>
		);
	}

	return null;
}
