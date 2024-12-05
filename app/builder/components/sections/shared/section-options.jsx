import {
	ArrowCounterClockwise,
	Broom,
	Columns,
	Eye,
	EyeSlash,
	List,
	PencilSimple,
	Plus,
	TrashSimple,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import from react-redux
import { RootState, AppDispatch } from "@/redux/store"; // Path to your store

export const SectionOptions = ({ id }) => {
	const dispatch = useDispatch(); // Get dispatch from Redux store

	const section = useSelector((state) => state.portfolio.profiles); // Get section from Redux store

	const hasItems = useMemo(() => "items" in section, [section]);
	const isCustomSection = useMemo(() => id.startsWith("custom"), [id]);

	const onCreate = () => {
		// This will open the dialog (assuming your dialog is managed in the store)
		dispatch({ type: "dialog/open", payload: { id, type: "create" } });
	};

	const toggleSeperateLinks = (checked) => {
		console.log("Separate link");
	};

	const toggleVisibility = () => {
		console.log("Toggle visibility");
	};

	const onResetName = () => {
		console.log("Reset name");
	};

	const onChangeColumns = (value) => {
		console.log("Change column");
		console.log(value);
	};

	const onResetItems = () => {
		console.log("Reset");
	};

	const onRemove = () => {
		console.log("Remove section Item");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<List weight="bold" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				{hasItems && (
					<>
						<DropdownMenuItem onClick={onCreate}>
							<Plus />
							<span className="ml-2">{`Add a new item`}</span>
						</DropdownMenuItem>
						<DropdownMenuCheckboxItem
							checked={section.separateLinks}
							onCheckedChange={toggleSeperateLinks}
						>
							<span className="ml-0">{`Separate Links`}</span>
						</DropdownMenuCheckboxItem>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={toggleVisibility}>
						{section.visible ? <Eye /> : <EyeSlash />}
						<span className="ml-2">
							{section.visible ? `Hide` : `Show`}
						</span>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<PencilSimple />
							<span className="ml-2">{`Rename`}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<div className="relative col-span-2">
								<Input
									id={`sections.${id}.name`}
									value={section.name}
									onChange={(event) => {
										console.log(event);
									}}
								/>
								<Button
									size="icon"
									variant="link"
									className="absolute inset-y-0 right-0"
									onClick={onResetName}
								>
									<ArrowCounterClockwise />
								</Button>
							</div>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Columns />
							<span className="ml-2">{`Columns`}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup
								value={`${section.columns}`}
								onValueChange={onChangeColumns}
							>
								{Array.from({ length: 5 }, (_, i) => i + 1).map(
									(value) => (
										<DropdownMenuRadioItem
											key={value}
											value={`${value}`}
										>
											{value} {"Columns"}
										</DropdownMenuRadioItem>
									)
								)}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled={!hasItems} onClick={onResetItems}>
					<Broom />
					<span className="ml-2">{`Reset`}</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-error"
					disabled={!isCustomSection}
					onClick={onRemove}
				>
					<TrashSimple />
					<span className="ml-2">{`Remove`}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};