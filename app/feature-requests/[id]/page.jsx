"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function FeatureRequestDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const [feature, setFeature] = useState(null);
	const [loading, setLoading] = useState(true);
	const [comment, setComment] = useState("");
	const [commentLoading, setCommentLoading] = useState(false);
	const { data } = useSession();
	const user = data?.user;

	useEffect(() => {
		fetchFeature();
		// eslint-disable-next-line
	}, [id]);

	async function fetchFeature() {
		setLoading(true);
		const res = await fetch(`/api/feature-requests/${id}`);
		const data = await res.json();
		setFeature(data);
		setLoading(false);
	}

	async function handleAddComment(e) {
		e.preventDefault();
		if (!comment.trim()) return;
		setCommentLoading(true);
		const res = await fetch(`/api/feature-requests/${id}/comment`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content: comment }),
		});
		setCommentLoading(false);
		if (res.ok) {
			setComment("");
			fetchFeature();
		} else {
			toast.error("Failed to add comment");
		}
	}

	if (loading)
		return <div className="container mx-auto py-10">Loading...</div>;
	if (!feature)
		return <div className="container mx-auto py-10">Not found</div>;

	return (
		<div className="container mx-auto py-10 max-w-2xl">
			<Button
				variant="outline"
				className="mb-4"
				onClick={() => router.back()}
			>
				← Back
			</Button>
			<Card>
				<CardContent className="p-6 flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<h2 className="font-bold text-2xl">{feature.title}</h2>
						<Badge>{feature.status}</Badge>
						<span className="text-xs text-muted-foreground">
							{feature.category}
						</span>
					</div>
					<div className="text-muted-foreground mb-2">
						{feature.description}
					</div>
					<div className="flex gap-2 items-center text-xs">
						<span>By {feature.author?.email}</span>
						<span>• {feature.votes.length} votes</span>
					</div>
				</CardContent>
			</Card>
			<div className="mt-8">
				<h3 className="font-semibold mb-2">Comments</h3>
				<div className="space-y-3 mb-4">
					{feature.comments.length === 0 && (
						<div className="text-sm text-muted-foreground">
							No comments yet.
						</div>
					)}
					{feature.comments.map((c) => (
						<Card key={c.id}>
							<CardContent className="p-3 flex flex-col gap-1">
								<div className="text-sm">{c.content}</div>
								<div className="text-xs text-muted-foreground">
									by {c.user?.email}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				{user.id && (
					<form
						onSubmit={handleAddComment}
						className="flex gap-2 items-center"
					>
						<input
							className="flex-1 p-2 border rounded"
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							disabled={commentLoading}
						/>
						<Button
							type="submit"
							disabled={commentLoading || !comment.trim()}
						>
							{commentLoading ? "Adding..." : "Comment"}
						</Button>
					</form>
				)}
				{!user.id && (
					<div className="text-xs text-muted-foreground mt-2">
						Login to comment.
					</div>
				)}
			</div>
		</div>
	);
}
