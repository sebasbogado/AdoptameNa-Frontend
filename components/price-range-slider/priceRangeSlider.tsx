'use client';
import React, { useEffect, useState } from 'react';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  onChange: (range: [number, number]) => void;
  renderValue: (value: number) => string;
};

export default function PriceRangeSlider({
  min,
  max,
  step = 1000,
  onChange,
  renderValue,
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  // Esta función es para calcular el porcentaje que se usa para la posición de los "thumbs"
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

  useEffect(() => {
    onChange([minVal, maxVal]);
  }, [minVal, maxVal]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Labels */}
      <div className="flex justify-between text-sm text-gray-600 px-1">
        <span>{renderValue(minVal)}</span>
        <span>{renderValue(maxVal)}</span>
      </div>

      {/* Slider Track + Thumbs */}
      <div className="relative w-full h-10">
        {/* Base track */}
        <div className="absolute top-4 h-1 w-full bg-gray-300 rounded" />

        {/* Active range */}
        <div
          className="absolute top-4 h-1 bg-blue-500 rounded"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) =>
            setMinVal(Math.min(Number(e.target.value), maxVal - step))
          }
          className="absolute w-full z-30 appearance-none bg-transparent pointer-events-auto"
          style={{
            left: `0`,
            top: '50%', // Alinea el thumb min al centro de la barra
            marginTop: '-15px', // Ajusta para centrarlo exactamente en el centro
            zIndex: 30, // Asegura que el "min" thumb esté en frente
          }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) =>
            setMaxVal(Math.max(Number(e.target.value), minVal + step))
          }
          className="absolute w-full z-20 appearance-none bg-transparent pointer-events-auto"
          style={{
            left: `0`,
            top: '50%', // Alinea el thumb max al centro de la barra
            marginTop: '-15px', // Ajusta para centrarlo exactamente en el centro
            zIndex: 20, // Asegura que el "max" thumb esté debajo del "min"
          }}
        />
      </div>

      {/* Inline styles for thumbs */}
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 30px;
          width: 8px; 
          background-color:rgb(90, 155, 91); 
          border-radius: 0; 
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          height: 30px;
          width: 8px;
          background-color:rgb(36, 63, 90);
          border-radius: 0;
          cursor: pointer;
        }

        input[type='range']::-webkit-slider-runnable-track {
          height: 1px;
        }

        input[type='range']::-moz-range-track {
          height: 1px;
        }
      `}</style>
    </div>
  );
}