import ComboboxAssignee from "./ComboboxAssignee";
import type { SearchUser } from "./ComboboxContributor";
import ComboboxContributor from "./ComboboxContributor";
import ComboboxPriority from "./ComboboxPriority";
import DatePicker from "./DatePicker";

type InputType =
	| "DatePicker"
	| "Assignee"
	| "email"
	| "password"
	| "text"
	| "Priority"
	| "Contributor";

interface CustomInputProps {
	label: string;
	inputID: string;
	type: InputType;
	required?: boolean;
	onValueChange?: () => void;
	error?: string;
	defaultValue?: SearchUser[] | undefined;
}

// Composant pour les inputs par défaut
const DefaultInput = ({
	inputID,
	type,
	required,
	error,
}: {
	inputID: string;
	type: "email" | "password" | "text";
	required?: boolean;
	error?: string;
}) => {
	return (
		<input
			id={inputID}
			name={inputID}
			type={type}
			className={`rounded-[4px] w-full min-h-13 bg-white body-xs focus:outline-none px-4.25 py-4.75 border ${error ? "border-red-500" : ""}`}
			required={required}
			aria-required={required}
			aria-invalid={!!error}
			aria-describedby={error ? `${inputID}-error` : undefined}
		/>
	);
};

const INPUT_COMPONENTS = {
	text: DefaultInput,
	email: DefaultInput,
	password: DefaultInput,
	DatePicker: DatePicker,
	Assignee: ComboboxAssignee,
	Contributor: ComboboxContributor,
	Priority: ComboboxPriority,
} as const;

export default function CustomInput({
	label,
	inputID,
	type,
	required = false,
	onValueChange,
	error,
	defaultValue,
}: CustomInputProps) {
	const isDefaultInput =
		type === "text" || type === "email" || type === "password";

	const renderInput = () => {
		if (isDefaultInput) {
			const Component = INPUT_COMPONENTS[type];
			return (
				<Component
					inputID={inputID}
					type={type}
					required={required}
					error={error}
				/>
			);
		}

		const Component = INPUT_COMPONENTS[type];
		return (
			<Component
				name={inputID}
				required={required}
				onValueChange={onValueChange}
				defaultValue={defaultValue}
			/>
		);
	};

	return (
		<div className="flex flex-col gap-1.75 w-full">
			<label id={`${inputID}-label`} className="body-s" htmlFor={inputID}>
				{label}
			</label>

			{renderInput()}

			{error && (
				<p
					id={`${inputID}-error`}
					role="alert"
					className="text-red-500 text-xs mt-1"
				>
					{error}
				</p>
			)}
		</div>
	);
}
