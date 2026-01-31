"use client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import CalendarSVG from "@/assets/icons/calendar.svg";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({
	name,
	onValueChange,
	required = false,
	variant = "default",
}: {
	name: string;
	onValueChange?: () => void;
	required?: boolean;
	variant?: string;
}) {
	const [date, setDate] = React.useState<Date>();
	return (
		<>
			<input
				type="hidden"
				name={name}
				value={date?.toISOString() || ""}
				required={required}
			/>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={name}
						data-empty={!date}
						aria-labelledby={`${name}-label`}
						aria-describedby={
							date
								? `Date sélectionnée : ${format(new Date(date), "d MMMM yyyy", { locale: fr })}`
								: undefined
						}
						className={
							variant === "default"
								? `data-[empty=true]:text-muted-foreground bg-white min-h-13.25
                                      border w-full flex flex-row-reverse justify-between text-gray-800 cursor-pointer`
								: "border shadow-md bg-gray-50"
						}
						variant="ghost"
					>
						{date ? (
							<>
								<CalendarSVG />
								{format(new Date(date), "d MMMM yyyy", { locale: fr })}
							</>
						) : (
							<>
								{""}
								<CalendarSVG />
							</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						onSelect={(newDate) => {
							setDate(newDate);
							setTimeout(() => onValueChange?.(), 0);
						}}
						defaultMonth={date}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}
