"use client";

import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioCard } from "../components/portfolio-card";
import { BaseCard } from "../components/base-card";
import { CreatePortfolioCard } from "../components/create-portfolio-card";

function Page() {
	const portfolios = useSelector((state) => state.portfolios.items);
	const loading = useSelector((state) => state.portfolios.loading);

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<CreatePortfolioCard />
			</motion.div>

			{loading &&
				Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="duration-300 animate-in fade-in"
						style={{
							animationFillMode: "backwards",
							animationDelay: `${i * 300}ms`,
						}}
					>
						<BaseCard />
					</div>
				))}

			{portfolios && (
				<AnimatePresence>
					{portfolios
						.sort(
							(a, b) =>
								new Date(b.updatedAt) - new Date(a.updatedAt)
						)
						.map((portfolio, index) => (
							<motion.div
								key={portfolio.id}
								layout
								initial={{ opacity: 0, x: -50 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { delay: (index + 2) * 0.1 },
								}}
								exit={{
									opacity: 0,
									filter: "blur(8px)",
									transition: { duration: 0.5 },
								}}
							>
								<PortfolioCard portfolio={portfolio} />
							</motion.div>
						))}
				</AnimatePresence>
			)}
		</div>
	);
}

export default Page;
