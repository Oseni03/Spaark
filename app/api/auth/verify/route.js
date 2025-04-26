import { verifyAuthToken } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const authToken = req.cookies.firebaseAuthToken;
		const decodedToken = await verifyAuthToken(authToken);
		return NextResponse.json({ verified: true, user: decodedToken });
	} catch (error) {
		return NextResponse.json(
			{ verified: false, error: error.message },
			{ status: 401 }
		);
	}
}
