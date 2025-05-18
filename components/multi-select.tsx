import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface BaseOption {
  id: number;
  name: string;
}

type MultiSelectProps<T extends BaseOption> = {
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  placeholder?: string;
  maxSelected?: number;
};

export function MultiSelect<T extends BaseOption>({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar opciones",
  maxSelected,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: T) => {
    const alreadySelected = selected.some((s) => s.id === option.id);

    if (alreadySelected) {
      onChange(selected.filter((s) => s.id !== option.id));
    } else {
      // Solo permite agregar si no se ha alcanzado el máximo
      if (!maxSelected || selected.length < maxSelected) {
        onChange([...selected, option]);
      }
    }
  };

  const isSelected = (option: T) => selected.some((s) => s.id === option.id);

  return (
    <div className="w-full relative mb-3">
      <button
        type="button"
        className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 ? (
            selected.map((s) => (
              <span
                key={s.id}
                className="bg-light-blue-50 px-3 py-1 rounded-full text-sm font-medium text-blue flex items-center gap-1 hover:bg-light-blue-300 transition-colors"
              >
                {s.name}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(s);
                  }}
                  className="cursor-pointer hover:text-blue-800"
                >
                  ×
                </span>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isOptionSelected = isSelected(option);
            const disabled = !isOptionSelected && maxSelected && selected.length >= maxSelected;

            return (
              <li
                key={option.id}
                className={`cursor-pointer px-4 py-2 hover:bg-blue-100 flex justify-between items-center 
        ${isOptionSelected ? 'bg-blue-50 font-medium' : ''} 
        ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!disabled) toggleOption(option);
                }}
              >
                <span>{option.name}</span>
                {isOptionSelected && <Check className="w-4 h-4 text-blue-600" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
