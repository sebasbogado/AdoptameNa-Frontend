import React from "react";
import { Listbox } from "@headlessui/react";

interface CustomSelectProps {
    label: string;
    options: string[];
    selected: string | null;
    setSelected: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, selected, setSelected }) => {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none">
                    {selected || label}
                    <span className="material-symbols-outlined">
                        keyboard_arrow_down
                    </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    {options.map((option, index) => (
                        <Listbox.Option
                            key={index}
                            value={option}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                            {option}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
};

export default CustomSelect;
