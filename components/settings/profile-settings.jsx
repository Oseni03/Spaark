"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ProfileUpdate } from "../forms/profile-update";

export function ProfileSettings() {
	const [error, setError] = useState(null);

	return (
		<div className="space-y-6">
			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your personal information and profile details
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Avatar Section */}
					{/* <div className="flex items-center space-x-4">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={user?.image || "/placeholder.svg"}
								alt={user?.name || user?.email}
							/>
							<AvatarFallback className="text-lg">
								{user?.name
									? user.name.charAt(0).toUpperCase()
									: user?.email?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<Button variant="outline" size="sm">
								<Camera className="mr-2 h-4 w-4" />
								Change Avatar
							</Button>
							<p className="text-xs text-muted-foreground">
								JPG, GIF or PNG. 1MB max.
							</p>
						</div>
					</div> */}

					<ProfileUpdate setError={setError} />
				</CardContent>
			</Card>
		</div>
	);
}
