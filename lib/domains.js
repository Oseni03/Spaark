export const addDomainToVercel = async (domain) => {
	return await fetch(
		`https://api.vercel.com/v10/projects/${
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
	).then((res) => res.json());
};

export const removeDomainFromVercelProject = async (domain) => {
	return await fetch(
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
	).then((res) => res.json());
};

export const getDomainResponse = async (domain) => {
	return await fetch(
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
	).then((res) => res.json());
};

export const getConfigResponse = async (domain) => {
	return await fetch(
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
	).then((res) => res.json());
};

export const verifyDomain = async (domain) => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${
			process.env.PROJECT_ID_VERCEL
		}/domains/${domain}/verify${
			process.env.TEAM_ID_VERCEL
				? `?teamId=${process.env.TEAM_ID_VERCEL}`
				: ""
		}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
			},
		}
	).then((res) => res.json());
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
