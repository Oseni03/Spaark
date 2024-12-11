/* eslint-disable react/display-name */
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Input } from "./input";

export const BadgeInput = forwardRef(
	({ value, onChange, setPendingKeyword, ...props }, ref) => {
		const [label, setLabel] = useState("");

		const processInput = useCallback(() => {
			const newLabels = label
				.split(",")
				.map((str) => str.trim())
				.filter(Boolean)
				.filter((str) => !value.includes(str));
			onChange([...new Set([...value, ...newLabels])]);
			setLabel("");
		}, [label, value, onChange]);

		useEffect(() => {
			if (label.includes(",")) {
				processInput();
			}
		}, [label, processInput]);

		useEffect(() => {
			if (setPendingKeyword) setPendingKeyword(label);
		}, [label, setPendingKeyword]);

		const onKeyDown = (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				processInput();
			}
		};

		return (
			<>
				<Input
					{...props}
					ref={ref}
					value={label}
					onKeyDown={onKeyDown}
					onChange={(event) => setLabel(event.target.value)}
				/>
				{props.error && (
					<small className="text-red-500 opacity-75">
						{props.error}
					</small>
				)}
			</>
		);
	}
);
