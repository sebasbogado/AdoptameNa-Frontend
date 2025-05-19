import React from "react";
import CustomSelect from "@/components/custom-select";

interface LabeledSelectProps {
    label: string;
    options: any[];
    selected: any;
    setSelected: (value: any) => void;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({ label, options, selected, setSelected }) => {
    return (
        <div className="flex flex-col w-[10rem] ">
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <CustomSelect label={label} options={options} selected={selected} setSelected={setSelected} />
        </div>
    );
};

export default LabeledSelect;
