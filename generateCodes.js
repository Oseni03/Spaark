const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const prisma = new PrismaClient();

async function generateAndStoreCodes(count = 100) {
	console.log(`Starting to generate ${count} codes...`);

	try {
		// Generate and store codes in batches to avoid memory issues
		const batchSize = 25;
		const batches = Math.ceil(count / batchSize);
		let allCodes = [];

		for (let i = 0; i < batches; i++) {
			const currentBatchSize = Math.min(batchSize, count - i * batchSize);
			const codes = Array.from({ length: currentBatchSize }, () => ({
				code: uuidv4(),
				type: "DISCOUNT", // Set code type here
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			}));

			console.log(`Generating batch ${i + 1} of ${batches}...`);

			// Create codes in database
			await prisma.code.createMany({
				data: codes,
			});

			allCodes = allCodes.concat(codes.map((c) => c.code));

			console.log(`Batch ${i + 1} of ${batches} completed.`);
		}

		// Write all codes to CSV
		fs.writeFileSync("generated_codes.csv", allCodes.join("\n"));
		console.log("CSV file written successfully.");

		console.log(`Successfully generated and stored ${count} codes.`);
	} catch (error) {
		console.error("Error generating codes:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the function
generateAndStoreCodes(1000);
