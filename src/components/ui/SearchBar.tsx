"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeSearch = searchParams.get("search") || "";
	const [currentSearch, setCurrentSearch] = useState(activeSearch);

	// Synchroniser l'input avec l'URL
	useEffect(() => {
		setCurrentSearch(activeSearch);
	}, [activeSearch]);

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			return params.toString();
		},
		[searchParams],
	);

	const handleClearSearch = () => {
		setCurrentSearch("");
		router.push(`${pathname}?${createQueryString("search", "")}`);
	};

	return (
		<div className="relative flex px-8 py-5.75 justify-between items-center bg-white border border-gray-200 rounded-xl gap-2">
			{activeSearch && (
				<div className="absolute left-8 flex items-center gap-1.5 px-2 py-1 border border-gray-300 rounded-full bg-white z-10">
					<span className="body-xs text-gray-700 whitespace-nowrap">
						{activeSearch}
					</span>
					<button
						type="button"
						onClick={handleClearSearch}
						className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
						aria-label="Supprimer la recherche"
					>
						<X size={12} className="stroke-gray-600" />
					</button>
				</div>
			)}

			<label htmlFor="searchBar" className="sr-only">
				Rechercher une tâche
			</label>
			<input
				id="searchBar"
				type="text"
				placeholder={activeSearch ? "" : "Rechercher une tâche"}
				className="body-s text-gray-600 w-full focus:outline-0"
				value={currentSearch}
				onChange={(e) => setCurrentSearch(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						router.push(
							`${pathname}?${createQueryString("search", currentSearch)}`,
						);
					}
				}}
			/>
			<button
				type="button"
				aria-label="Lancer la recherche"
				onClick={() => {
					router.push(
						`${pathname}?${createQueryString("search", currentSearch)}`,
					);
				}}
			>
				<Search stroke="#6B7280" size={14} />
			</button>
		</div>
	);
}
