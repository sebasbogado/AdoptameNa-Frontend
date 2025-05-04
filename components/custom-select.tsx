import React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";

interface CustomSelectProps {
    label: string;
    options: string[];
    selected: string | null;
    setSelected: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, selected, setSelected }) => {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative text-sm lg:text-sm md:text-sm">
                <Listbox.Button className=" w-full min-w-44 flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none">
                    {selected || label}
                    <ChevronDownIcon className="w-5 h-5 text-gray-500"  />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
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
