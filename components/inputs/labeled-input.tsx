'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface LabeledInputProps {
  label?: string;
  value: number | null; // Se espera un número o null
  onChange: (value: number | null) => void; // onChange pasa un número o null
  placeholder?: string;
  min?: number;
  maxLength?: number; // controla cuántos dígitos queremos mostrar bien
  debounceDelay?: number; // Controla el tiempo de debounce
  className?: string; // Nueva prop para clases CSS personalizadas
}

const formatNumber = (num: number) => {
  // Formateamos el número para que incluya los separadores de miles
  return num.toLocaleString('es-PY');
};

const unformatNumber = (val: string) => {
  // Eliminamos los puntos (separadores de miles) para trabajar con el número crudo
  return val.replace(/\./g, '');
};

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  min = 0,
  maxLength = 15, //numeros visibles + puntos separadores.
  debounceDelay = 500, // Valor por defecto de 500ms de debounce
  className = '', // Valor por defecto vacío
}) => {
  const [inputValue, setInputValue] = useState(value !== null ? formatNumber(value) : ''); 
  const debouncedOnChange = useDebounce((val: number | null) => {
    onChange(val);
  }, debounceDelay);

  // Actualizar el valor en el estado de inputValue y disparar el cambio con debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let val = e.target.value;

  val = val.replace(/\./g, '');
  if (val.length > maxLength) return;
  val = val.replace(/[^0-9]/g, '');

  setInputValue(formatNumber(Number(val)));

  const unformattedValue = unformatNumber(val);
  if (unformattedValue === '') {
    debouncedOnChange(null);
  } else {
    const parsed = parseInt(unformattedValue);
    if (!isNaN(parsed) && parsed >= min) {
      debouncedOnChange(parsed);
    }
  }
};

  // Limpia el input cuando el valor es null
  useEffect(() => {
    if (value === null) {
      setInputValue(''); // Si el valor es null, limpia el campo
    } else {
      setInputValue(formatNumber(value)); // Si no es null, muestra el valor formateado
    }
  }, [value]); // Cuando `value` cambie, se ejecuta este efecto

  return (
    <div className={`flex flex-col col-span-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="relative flex items-center">
        {/* Icono ₲ */}
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          ₲
        </span>

        {/* Input */}
        <input
          type="text"
          inputMode="numeric"
          className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9747FF] w-full"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default LabeledInput;
