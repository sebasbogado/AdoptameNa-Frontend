import React from "react";
import CustomSelect from "@/components/custom-select";

interface LabeledSelectProps {
    label: string;
    options: any[];
    selected: any;
    setSelected: (value: any) => void;
    className?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({ label, options, selected, setSelected, className="" }) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <CustomSelect label={label} options={options} selected={selected} setSelected={setSelected} />
        </div>
    );
};

export default LabeledSelect;
