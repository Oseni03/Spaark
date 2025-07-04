export const addDomainToVercel = async (domain) => {
	try {
		const response = await fetch(
			`https://api.vercel.com/v9/projects/${
				process.env.PROJECT_ID_VERCEL
			}/domains${
				process.env.TEAM_ID_VERCEL
					? `?teamId=${process.env.TEAM_ID_VERCEL}`
					: ""
			}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: domain }),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			return { error };
		}

		return await response.json();
	} catch (error) {
		return { error: { message: "Failed to add domain to Vercel" } };
	}
};

export const removeDomainFromVercelProject = async (domain) => {
	try {
		const response = await fetch(
			`https://api.vercel.com/v9/projects/${
				process.env.PROJECT_ID_VERCEL
			}/domains/${domain}${
				process.env.TEAM_ID_VERCEL
					? `?teamId=${process.env.TEAM_ID_VERCEL}`
					: ""
			}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
				},
				method: "DELETE",
			}
		);

		if (!response.ok) {
			const error = await response.json();
			return { error };
		}

		return { success: true };
	} catch (error) {
		return { error: { message: "Failed to remove domain from Vercel" } };
	}
};

export const getDomainResponse = async (domain) => {
	try {
		const response = await fetch(
			`https://api.vercel.com/v9/projects/${
				process.env.PROJECT_ID_VERCEL
			}/domains/${domain}${
				process.env.TEAM_ID_VERCEL
					? `?teamId=${process.env.TEAM_ID_VERCEL}`
					: ""
			}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			// Domain not found
			if (response.status === 404) {
				return { error: { message: "Domain not found" } };
			}
			const error = await response.json();
			return { error };
		}

		return await response.json();
	} catch (error) {
		return { error: { message: "Failed to get domain information" } };
	}
};

export const getConfigResponse = async (domain) => {
	try {
		const response = await fetch(
			`https://api.vercel.com/v6/domains/${domain}/config${
				process.env.TEAM_ID_VERCEL
					? `?teamId=${process.env.TEAM_ID_VERCEL}`
					: ""
			}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			const error = await response.json();
			return { error };
		}

		return await response.json();
	} catch (error) {
		return { error: { message: "Failed to get domain configuration" } };
	}
};

// Domain validation regex
export const validDomainRegex = new RegExp(
	/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
);

// Helper functions
export const getSubdomain = (name, apexName) => {
	if (name === apexName) return null;
	return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url) => {
	let domain;
	try {
		domain = new URL(url).hostname;
	} catch (e) {
		return "";
	}

	const parts = domain.split(".");
	if (parts.length > 2) {
		return parts.slice(-2).join(".");
	}
	return domain;
};
