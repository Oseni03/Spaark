export const slugify = (text) => {
	return text
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "");
};

export const extractTextFromPortableTextBlock = (block) => {
	return block.children
		.filter(
			(child) =>
				typeof child === "object" && "_type" in child && "text" in child
		)
		.map((child) => child.text)
		.join("");
};
