"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, DownloadSimple } from "@phosphor-icons/react";
import { JsonResumeParser } from "@/lib/parsers/json-resume";
import { LinkedInParser } from "@/lib/parsers/linkedin";
import { ReactiveResumeV3Parser } from "@/lib/parsers/reactive-resume-v3";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { toast } from "sonner";
import { useImportResume } from "@/hooks/use-import-resume";
import { logger } from "@/lib/utils";

const ImportType = {
	// "reactive-resume-json": "reactive-resume-json",
	"reactive-resume-v3-json": "reactive-resume-v3-json",
	"json-resume-json": "json-resume-json",
	"linkedin-data-export-zip": "linkedin-data-export-zip",
};

const formSchema = z.object({
	file: z.instanceof(File),
	type: z.string(),
});

// type ValidationResult =
//   | {
//       isValid: false;
//       errors: string;
//     }
//   | {
//       isValid: true;
//       type: ImportType;
//       result: ResumeData | ReactiveResumeV3 | LinkedIn | JsonResume;
//     };

export const ImportDialog = ({ isOpen, setIsOpen }) => {
	const { importResume, loading } = useImportResume();
	const [validationResult, setValidationResult] = useState(null);

	const form = useForm({
		defaultValues: {
			type: ImportType["reactive-resume-v3-json"],
		},
		resolver: zodResolver(formSchema),
	});
	const filetype = form.watch("type");

	const onReset = useCallback(() => {
		form.reset();
		setValidationResult(null);
	}, [form]);

	const accept = useMemo(() => {
		if (filetype.includes("json")) return ".json";
		if (filetype.includes("zip")) return ".zip";
		return "";
	}, [filetype]);

	const onValidate = async () => {
		try {
			const { file, type } = formSchema.parse(form.getValues());

			if (type === ImportType["reactive-resume-v3-json"]) {
				const parser = new ReactiveResumeV3Parser();
				const data = await parser.readFile(file);
				logger.info("Parsed data: ", data);
				const result = parser.validate(data);
				logger.info("Validation result: ", result);

				setValidationResult({ isValid: true, type, result });
			}

			if (type === ImportType["json-resume-json"]) {
				const parser = new JsonResumeParser();
				const data = await parser.readFile(file);
				const result = parser.validate(data);

				setValidationResult({ isValid: true, type, result });
			}

			if (type === ImportType["linkedin-data-export-zip"]) {
				const parser = new LinkedInParser();
				const data = await parser.readFile(file);
				const result = await parser.validate(data);

				setValidationResult({ isValid: true, type, result });
			}
		} catch (error) {
			if (error instanceof ZodError) {
				setValidationResult({
					isValid: false,
					errors: error.toString(),
				});

				toast({
					variant: "error",
					title: `An error occurred while validating the file.`,
				});
			}
		}
	};

	const onImport = async () => {
		const { type } = formSchema.parse(form.getValues());

		if (!validationResult?.isValid || validationResult.type !== type)
			return;

		try {
			if (type === ImportType["reactive-resume-v3-json"]) {
				const parser = new ReactiveResumeV3Parser();
				const data = parser.convert(validationResult.result);

				await importResume({ data });
			}

			if (type === ImportType["json-resume-json"]) {
				const parser = new JsonResumeParser();
				const data = parser.convert(validationResult.result);

				await importResume({ data });
			}

			if (type === ImportType["linkedin-data-export-zip"]) {
				const parser = new LinkedInParser();
				const data = parser.convert(validationResult.result);

				await importResume({ data });
			}

			setIsOpen(false);
		} catch (error) {
			toast.error(`Oops, the server returned an error.`, {
				description: error instanceof Error ? error.message : undefined,
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<Form {...form}>
					<form className="space-y-4">
						<DialogHeader>
							<DialogTitle>
								<div className="flex items-center space-x-2.5">
									<DownloadSimple />
									<h2>{`Import from resume`}</h2>
								</div>
							</DialogTitle>
							<DialogDescription>
								{`Upload a file from one of the accepted sources to parse existing data and import it as portfolio for easier editing.`}
							</DialogDescription>
						</DialogHeader>

						<FormField
							name="type"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{`Filetype`}</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={`Please select a file type`}
												/>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="reactive-resume-v3-json">
													Reactive Resume v3 (.json)
												</SelectItem>
												<SelectItem value="json-resume-json">
													JSON Resume (.json)
												</SelectItem>
												<SelectItem value="linkedin-data-export-zip">
													LinkedIn Data Export (.zip)
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="file"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{`File`}</FormLabel>
									<FormControl>
										<Input
											key={`${accept}-${filetype}`}
											type="file"
											accept={accept}
											onChange={(event) => {
												if (!event.target.files?.length)
													return;
												field.onChange(
													event.target.files[0]
												);
											}}
										/>
									</FormControl>
									<FormMessage />
									{accept && (
										<FormDescription>
											{`Accepts only ${accept} files`}
										</FormDescription>
									)}
								</FormItem>
							)}
						/>

						{validationResult?.isValid === false && (
							<div className="space-y-2">
								<Label className="text-error">{`Errors`}</Label>
								<ScrollArea
									orientation="vertical"
									className="h-[180px]"
								>
									<div className="whitespace-pre-wrap rounded bg-secondary-accent p-4 font-mono text-xs leading-relaxed">
										{JSON.stringify(
											JSON.parse(validationResult.errors),
											null,
											4
										)}
									</div>
								</ScrollArea>
							</div>
						)}

						<DialogFooter>
							<AnimatePresence presenceAffectsLayout>
								{!validationResult && (
									<Button type="button" onClick={onValidate}>
										{`Validate`}
									</Button>
								)}

								{validationResult !== null &&
									!validationResult.isValid && (
										<Button
											type="button"
											variant="secondary"
											onClick={onReset}
										>
											{`Discard`}
										</Button>
									)}

								{validationResult !== null &&
									validationResult.isValid && (
										<>
											<Button
												type="button"
												disabled={loading}
												onClick={onImport}
											>
												{`Import`}
											</Button>

											<Button
												disabled
												type="button"
												variant="success"
											>
												<Check
													size={16}
													weight="bold"
													className="mr-2"
												/>
												{`Validated`}
											</Button>
										</>
									)}
							</AnimatePresence>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
