"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from "@/components/motion-primitives/disclosure";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";

export default function FeatureRequestsPage() {
	const [features, setFeatures] = useState([]);
	const [loading, setLoading] = useState(false);
	const { data } = useSession();
	const user = data?.user;

	useEffect(() => {
		fetchFeatures();
	}, []);

	async function fetchFeatures() {
		setLoading(true);
		const res = await fetch(`/api/feature-requests`);
		let data = await res.json();
		// Sort by number of upvotes (votes.length)
		data = data.sort(
			(a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)
		);
		setFeatures(data);
		setLoading(false);
	}

	async function handleUpvote(id) {
		if (!user.id) return toast.info("Login required");
		const res = await fetch(`/api/feature-requests/${id}/vote`, {
			method: "POST",
		});
		if (res.ok) fetchFeatures();
		else toast.info("Already voted or error");
	}

	return (
		<div className="container mx-auto py-10 max-w-3xl">
			<div className="mb-6">
				<Disclosure className="w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700">
					<DisclosureTrigger>
						<button
							className="w-full py-3 text-left font-medium"
							type="button"
						>
							💡 Submit a new feature request
						</button>
					</DisclosureTrigger>
					<DisclosureContent>
						<div className="overflow-hidden pb-3">
							<FeatureRequestForm
								onSubmitted={fetchFeatures}
								user={user}
							/>
						</div>
					</DisclosureContent>
				</Disclosure>
			</div>
			{loading ? (
				<div>Loading feedbacks...</div>
			) : (
				<div className="space-y-4">
					{features.map((feature) => (
						<Card
							key={feature.id}
							className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
						>
							<CardContent className="p-4 flex flex-col gap-2">
								<div className="flex items-center gap-2 justify-between">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-lg">
											<Link
												href={`/feature-requests/${feature.id}`}
												className="hover:underline"
											>
												{feature.title}
											</Link>
										</h3>
									</div>
									<div className="relative">
										<Button
											size="icon"
											onClick={() =>
												handleUpvote(feature.id)
											}
											disabled={!user.id}
											aria-label="Upvote"
										>
											<ArrowUp />
											<span className="sr-only">
												Upvote
											</span>
										</Button>
										<Badge
											variant="secondary"
											className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
										>
											{feature.votes.length}
										</Badge>
									</div>
								</div>
								<div className="text-sm text-muted-foreground">
									{feature.description}
								</div>
								<div className="flex gap-2 items-center">
									<span className="text-xs">
										by{" "}
										{feature.author?.email || "Anonymous"}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

function FeatureRequestForm({ onSubmitted, user }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!user) {
			return toast.info("Login required");
		}
		try {
			setLoading(true);
			const res = await fetch("/api/feature-requests", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});
			setLoading(false);
			if (res.ok) {
				setTitle("");
				setDescription("");
				onSubmitted();
			} else {
				if (res.status === 401) return toast.error("Login required");
				toast.error("Failed to submit");
			}
		} catch (error) {}
	}

	return (
		<div className="pt-3">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Input
						className="w-full p-2 border-none"
						placeholder="Enter feature title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div>
					<Textarea
						className="w-full p-2 border-none"
						placeholder="Describe the feature you'd like to see"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="flex gap-2 justify-end">
					<Button type="submit" disabled={loading} size="sm">
						{loading ? "Submitting..." : "Submit Request"}
					</Button>
				</div>
			</form>
		</div>
	);
}
