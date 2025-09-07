import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
// import { organizationClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
	plugins: [polarClient(), magicLinkClient(), customSessionClient()],
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
