"use client";

import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioCard } from "../components/portfolio-card";
import { BaseCard } from "../components/base-card";
import { CreateButton } from "../components/create-button";

function Page() {
	const portfolios = useSelector((state) => state.portfolios.items);
	const loading = useSelector((state) => state.portfolios.loading);

	return (
		<div className="space-y-6">
			{/* Header with Create Button */}
			<div className="grid gap-2 md:flex md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Portfolios
					</h1>
					<p className="text-muted-foreground">
						Manage and create your portfolios
					</p>
				</div>
				<CreateButton />
			</div>

			{/* Portfolios Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				{loading &&
					Array.from({ length: 6 }).map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.3,
								delay: i * 0.1,
							}}
							className="duration-300 animate-in fade-in"
							style={{
								animationFillMode: "backwards",
								animationDelay: `${i * 100}ms`,
							}}
						>
							<BaseCard />
						</motion.div>
					))}

				{portfolios && (
					<AnimatePresence key={"portfolios"}>
						{portfolios.map((portfolio, index) => (
							<motion.div
								key={portfolio.id || index}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.3,
										delay: index * 0.1,
									},
								}}
								exit={{
									opacity: 0,
									filter: "blur(8px)",
									transition: { duration: 0.3 },
								}}
							>
								<PortfolioCard portfolio={portfolio} />
							</motion.div>
						))}
					</AnimatePresence>
				)}

				{/* Empty State */}
				{!loading && portfolios && portfolios.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="col-span-full flex flex-col items-center justify-center py-12 text-center"
					>
						<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold mb-2">
							No portfolios yet
						</h3>
						<p className="text-muted-foreground mb-4">
							Create your first portfolio to get started
						</p>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default Page;
