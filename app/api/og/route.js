// app/api/og/route.tsx
import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "white",
					background: "linear-gradient(to right, #4f46e5, #7c3aed)",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
						padding: "20px 40px",
						textAlign: "center",
						color: "white",
					}}
				>
					<h1
						style={{
							fontSize: "60px",
							fontWeight: "bold",
							marginBottom: "20px",
							letterSpacing: "-0.025em",
						}}
					>
						{siteConfig.name}
					</h1>
					<p style={{ fontSize: "30px", opacity: 0.9 }}>
						{siteConfig.heroIntro}
					</p>

					<div
						style={{
							display: "flex",
							gap: "16px",
							marginTop: "40px",
						}}
					>
						{["React", "Next.js", "Tailwind"].map((tech, i) => (
							<div
								key={i}
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									padding: "8px 16px",
									borderRadius: "9999px",
									fontSize: "20px",
								}}
							>
								{tech}
							</div>
						))}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
