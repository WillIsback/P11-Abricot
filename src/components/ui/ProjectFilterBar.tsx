"use client";
import Chips from "./Chips";
import DropdownStatusMenu from "./DropdownStatusMenu";
import SearchBar from "./SearchBar";

export default function ProjetFilterBar() {
	return (
		<div className="flex flex-col md:flex-row w-full items-stretch h-fit justify-between">
			<div className="flexflex-col gap-2 justify-center md:items-stretch">
				<h2>Tâches</h2>
				<p className="body-m text-gray-600">Par odre de priorité</p>
			</div>
			<div className="flex flex-col md:flex-row items-start w-fit h-fit gap-4">
				<div className="flex gap-2.5 h-45/63 w-fit m-auto">
					<Chips type="task" />
					<Chips type="calendar" />
				</div>
				<DropdownStatusMenu />
				<SearchBar />
			</div>
		</div>
	);
}
