'use client';
import Chips from "./Chips";
import DropdownMenuRadioGroupDemo from "./DropdownMenuRadioGroup";
import SearchBar from "./SearchBar";
export default function ProjetFilterBar({}){
    return (
        <div className="flex w-full h-fit items-center justify-between">
            <div className="flex flex-col gap-2">
                <h5>Tâches</h5>
                <p className="body-m text-gray-600">Par odre de priorité</p>
            </div>
            <div className="flex w-fit gap-4 items-center">
                <div className="flex gap-2.5 h-63/45">
                    <Chips type='task'/>
                    <Chips type="kanban"/>
                </div>
                <DropdownMenuRadioGroupDemo />
                <SearchBar />
            </div>
        </div>
    )
}