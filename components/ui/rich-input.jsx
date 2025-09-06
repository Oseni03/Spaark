import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowClockwise,
	ArrowCounterClockwise,
	Code as CodeIcon,
	CodeBlock as CodeBlockIcon,
	HighlighterCircle,
	Image as ImageIcon,
	KeyReturn,
	LinkSimple,
	ListBullets,
	ListNumbers,
	Minus,
	Paragraph as ParagraphIcon,
	TextAlignCenter,
	TextAlignJustify,
	TextAlignLeft,
	TextAlignRight,
	TextAUnderline,
	TextB,
	TextHOne,
	TextHThree,
	TextHTwo,
	TextIndent,
	TextItalic,
	TextOutdent,
	TextStrikethrough,
} from "@phosphor-icons/react";
import { BubbleMenu } from "@tiptap/react";
import { Bold, Italic, Code, Link as LinkIcon } from "lucide-react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import {
	Editor,
	EditorContent,
	EditorContentProps,
	useEditor,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { forwardRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";
import { Popover, PopoverContent } from "./popover";
import { Skeleton } from "./skeleton";
import { Toggle } from "./toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const InsertImageFormSchema = z.object({
	src: z.string(),
	alt: z.string().optional(),
});

const InsertImageForm = ({ onInsert }) => {
	const form = useForm({
		resolver: zodResolver(InsertImageFormSchema),
		defaultValues: { src: "", alt: "" },
	});

	const onSubmit = (values) => {
		onInsert(values);
		form.reset();
	};

	return (
		<Form {...form}>
			<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
				<p className="prose prose-sm prose-zinc dark:prose-invert">
					Insert an image from an external URL and use it on your
					resume.
				</p>

				<FormField
					name="src"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input placeholder="https://..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="alt"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<div className="!mt-5 ml-auto max-w-fit">
					<Button type="submit" variant="secondary" size="sm">
						Insert Image
					</Button>
				</div>
			</form>
		</Form>
	);
};

const Toolbar = ({ editor }) => {
	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();

			return;
		}

		// update link
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	}, [editor]);

	return (
		<div className="flex flex-wrap gap-0.5 border p-1">
			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("bold")}
						disabled={!editor.can().chain().toggleBold().run()}
						onPressedChange={() =>
							editor.chain().focus().toggleBold().run()
						}
					>
						<TextB />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Bold</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("italic")}
						disabled={
							!editor.can().chain().focus().toggleItalic().run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleItalic().run()
						}
					>
						<TextItalic />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Italic</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("strike")}
						disabled={
							!editor.can().chain().focus().toggleStrike().run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleStrike().run()
						}
					>
						<TextStrikethrough />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Strikethrough</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("underline")}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleUnderline()
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleUnderline().run()
						}
					>
						<TextAUnderline />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Underline</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("highlight")}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleHighlight()
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleHighlight().run()
						}
					>
						<HighlighterCircle />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Highlight</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						className="px-2"
						onClick={setLink}
					>
						<LinkSimple />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Hyperlink</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("code")}
						disabled={
							!editor.can().chain().focus().toggleCode().run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleCode().run()
						}
					>
						<CodeIcon />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Inline Code</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("codeBlock")}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleCodeBlock()
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleCodeBlock().run()
						}
					>
						<CodeBlockIcon />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Code Block</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 1 })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleHeading({ level: 1 })
								.run()
						}
						onPressedChange={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 1 })
								.run()
						}
					>
						<TextHOne />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Heading 1</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 2 })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleHeading({ level: 2 })
								.run()
						}
						onPressedChange={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 2 })
								.run()
						}
					>
						<TextHTwo />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Heading 2</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 3 })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleHeading({ level: 3 })
								.run()
						}
						onPressedChange={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 3 })
								.run()
						}
					>
						<TextHThree />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Heading 3</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("paragraph")}
						onPressedChange={() =>
							editor.chain().focus().setParagraph().run()
						}
					>
						<ParagraphIcon />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Paragraph</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "left" })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.setTextAlign("left")
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("left").run()
						}
					>
						<TextAlignLeft />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Align Left</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "center" })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.setTextAlign("center")
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("center").run()
						}
					>
						<TextAlignCenter />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Align Center</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "right" })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.setTextAlign("right")
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("right").run()
						}
					>
						<TextAlignRight />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Align Right</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "justify" })}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.setTextAlign("justify")
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("justify").run()
						}
					>
						<TextAlignJustify />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Align Justify</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Toggle
						size="sm"
						pressed={editor.isActive("bulletList")}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleBulletList()
								.run()
						}
						onPressedChange={() =>
							editor.chain().focus().toggleBulletList().run()
						}
					>
						<ListBullets />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>Bullet List</TooltipContent>
			</Tooltip>

			<Tooltip content="Numbered List">
				<TooltipTrigger></TooltipTrigger>
				<TooltipContent></TooltipContent>
				<Toggle
					size="sm"
					pressed={editor.isActive("orderedList")}
					disabled={
						!editor.can().chain().focus().toggleOrderedList().run()
					}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<ListNumbers />
				</Toggle>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.liftListItem("listItem")
								.run()
						}
						onClick={() =>
							editor
								.chain()
								.focus()
								.liftListItem("listItem")
								.run()
						}
					>
						<TextOutdent />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Outdent</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.sinkListItem("listItem")
								.run()
						}
						onClick={() =>
							editor
								.chain()
								.focus()
								.sinkListItem("listItem")
								.run()
						}
					>
						<TextIndent />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Indent</TooltipContent>
			</Tooltip>

			<Popover>
				<Tooltip>
					<TooltipTrigger>
						<PopoverTrigger asChild>
							<Button size="sm" variant="ghost" className="px-2">
								<ImageIcon />
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>Insert Image</TooltipContent>
				</Tooltip>
				<PopoverContent className="w-80">
					<InsertImageForm
						onInsert={(props) =>
							editor.chain().focus().setImage(props).run()
						}
					/>
				</PopoverContent>
			</Popover>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={
							!editor.can().chain().focus().setHardBreak().run()
						}
						onClick={() =>
							editor.chain().focus().setHardBreak().run()
						}
					>
						<KeyReturn />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Insert Break Line</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.setHorizontalRule()
								.run()
						}
						onClick={() =>
							editor.chain().focus().setHorizontalRule().run()
						}
					>
						<Minus />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Insert Horizontal Rule</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={!editor.can().undo()}
						onClick={() => editor.chain().focus().undo().run()}
					>
						<ArrowCounterClockwise />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Undo</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger>
					<Button
						size="sm"
						variant="ghost"
						className="px-2"
						disabled={!editor.can().redo()}
						onClick={() => editor.chain().focus().redo().run()}
					>
						<ArrowClockwise />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Redo</TooltipContent>
			</Tooltip>
		</div>
	);
};

export const RichInput = forwardRef(
	(
		{
			content,
			onChange,
			footer,
			hideToolbar = false,
			className,
			editorClassName,
			...props
		},
		_ref
	) => {
		const editor = useEditor({
			extensions: [
				StarterKit,
				Image,
				Underline,
				Highlight,
				TextAlign.configure({ types: ["heading", "paragraph"] }),
				Link.extend({ inclusive: false }).configure({
					openOnClick: false,
				}),
			],
			editorProps: {
				attributes: {
					class: cn(
						"prose prose-sm prose-zinc max-h-[200px] max-w-none overflow-y-scroll dark:prose-invert focus:outline-none [&_*]:my-2",
						editorClassName
					),
				},
			},
			content,
			parseOptions: { preserveWhitespace: "full" },
			onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
		});

		const [dragActive, setDragActive] = React.useState(false);

		const handleDrop = React.useCallback(
			(e) => {
				e.preventDefault();
				setDragActive(false);

				if (e.dataTransfer.files && e.dataTransfer.files[0]) {
					const file = e.dataTransfer.files[0];
					if (file.type.startsWith("image/")) {
						const reader = new FileReader();
						reader.onload = (event) => {
							editor
								.chain()
								.focus()
								.setImage({
									src: event.target.result,
									alt: file.name,
									title: file.name,
								})
								.run();
						};
						reader.readAsDataURL(file);
					}
				}
			},
			[editor]
		);

		const handleDrag = React.useCallback((e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.type === "dragenter" || e.type === "dragover") {
				setDragActive(true);
			} else if (e.type === "dragleave") {
				setDragActive(false);
			}
		}, []);

		if (!editor) {
			return (
				<div className="space-y-2">
					<Skeleton
						className={cn(
							"h-[42px] w-full",
							hideToolbar && "hidden"
						)}
					/>
					<Skeleton className="h-[90px] w-full" />
				</div>
			);
		}

		return (
			<div
				className={`${dragActive ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
			>
				{!hideToolbar && <Toolbar editor={editor} />}

				{editor && (
					<BubbleMenu
						editor={editor}
						tippyOptions={{ duration: 100 }}
						className="bg-primary-foreground rounded-md shadow-lg border p-1 flex gap-1"
					>
						<Button
							variant={
								editor.isActive("bold") ? "secondary" : "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleBold().run()
							}
						>
							<Bold className="h-3 w-3" />
						</Button>
						<Button
							variant={
								editor.isActive("italic")
									? "secondary"
									: "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleItalic().run()
							}
						>
							<Italic className="h-3 w-3" />
						</Button>
						<Button
							variant={
								editor.isActive("code") ? "secondary" : "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleCode().run()
							}
						>
							<Code className="h-3 w-3" />
						</Button>
						<Button
							variant={
								editor.isActive("strike")
									? "secondary"
									: "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleStrike().run()
							}
						>
							<TextStrikethrough className="h-3 w-3" />
						</Button>
						<Button
							variant={
								editor.isActive("underline")
									? "secondary"
									: "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleUnderline().run()
							}
						>
							<TextAUnderline className="h-3 w-3" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								const url = window.prompt("Enter URL");
								if (url) {
									editor
										.chain()
										.focus()
										.setLink({ href: url })
										.run();
								}
							}}
						>
							<LinkIcon className="h-3 w-3" />
						</Button>
						<Button
							variant={
								editor.isActive("codeBlock")
									? "secondary"
									: "ghost"
							}
							size="sm"
							onClick={() =>
								editor.chain().focus().toggleCodeBlock().run()
							}
						>
							<CodeBlockIcon className="h-3 w-3" />
						</Button>
					</BubbleMenu>
				)}

				<EditorContent
					editor={editor}
					className={cn(
						"grid min-h-[160px] w-full rounded-sm border bg-transparent px-3 py-2 text-sm placeholder:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
						hideToolbar && "pt-2",
						className
					)}
					{...props}
				/>

				{footer?.(editor)}
			</div>
		);
	}
);

RichInput.displayName = "RichInput";
