import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn, logger } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { validDomainRegex } from "@/lib/domains";
import { Input } from "../ui/input";
import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Plus,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { updatePortfolio } from "@/redux/features/portfolioSlice";
import { useDispatch } from "react-redux";

const formSchema = z.object({
	domain: z
		.string()
		.min(3)
		.refine((args) => validDomainRegex.test(args))
		.refine((args) => {
			if (args.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
				return false;
			}
			return true;
		}, `Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`),
});

export const DomainForm = ({ className, portfolio, ...props }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			domain: "",
		},
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
		getValues,
		setError,
	} = form;

	const onSubmit = async (values) => {
		setIsLoading(true);
		try {
			if (portfolio?.customDomain === values.domain) {
				setError(
					"domain",
					{
						message:
							"This domain is already configured for this portfolio",
						type: "validate",
					},
					{ shouldFocus: true }
				);
				return;
			}
			if (!portfolio.isLive) {
				throw new Error("Domain can only be added to a live portfolio");
			}
			// First verify/add domain with Vercel
			// Add domain to Vercel and update portfolio
			const domainResponse = await fetch("/api/domains", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					domain: values.domain,
					portfolioId: portfolio.id,
				}),
			});

			if (!domainResponse.ok) {
				const error = await domainResponse.json();
				logger.error("Domain error: ", error);
				throw new Error(error.error || "Failed to add domain");
			}

			const resp = await domainResponse.json();

			if (resp.success) {
				dispatch(
					updatePortfolio({
						id: portfolioId,
						data: { customDomain: values.domain },
					})
				);
				toast.success(
					resp.data.message || "Domain added successfully!"
				);

				// Refresh portfolio data
				// The portfolio will be updated via the API response
			} else {
				throw new Error(resp.error || "Failed to add domain");
			}
		} catch (error) {
			toast.error(error.message || "Failed to add domain");
			logger.error("Error adding domain:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<div className="flex flex-col gap-2">
							<div className="flex-1 relative">
								<FormField
									control={form.control}
									name="domain"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Domain</FormLabel>
											<FormControl>
												<Input
													placeholder="yourdomain.com"
													disabled={isSubmitting}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{getValues().domain && isValid && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
									</div>
								)}
								{!isValid && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<XCircle className="h-4 w-4 text-red-500" />
									</div>
								)}
							</div>
							<Button
								type="submit"
								disabled={!isValid}
								className="w-full sm:w-auto"
							>
								{isSubmitting || isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" />
										Add Domain
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};
