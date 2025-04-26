// lib/firebase/admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
	credential: cert({
		projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
		clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
			/\\n/g,
			"\n"
		),
	}),
};

export const firebaseAdmin =
	getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminAuth = getAuth(firebaseAdmin);

// Verify a Firebase ID token
export const verifyAuthToken = async (token) => {
	if (!token) return null;
	try {
		const decodedToken = await getAuth().verifyIdToken(token);
		return decodedToken;
	} catch (error) {
		console.error("Error verifying auth token:", error);
		return null;
	}
};
