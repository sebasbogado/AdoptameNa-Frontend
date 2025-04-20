'use client';
import React from 'react';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  renderValue: (value: number) => string;
};

export default function PriceRangeSlider({
  min,
  max,
  step = 1000,
  value,
  onChange,
  renderValue,
}: PriceRangeSliderProps) {
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-sm text-gray-600 px-1">
        <span>{renderValue(value[0])}</span>
        <span>{renderValue(value[1])}</span>
      </div>

      <div className="relative w-full h-10">
        <div className="absolute top-4 h-1 w-full bg-gray-300 rounded" />
        <div
          className="absolute top-4 h-1 bg-blue-500 rounded"
          style={{
            left: `${getPercent(value[0])}%`,
            width: `${getPercent(value[1]) - getPercent(value[0])}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), value[1] - step), value[1]])
          }
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-30"
          style={{ top: '50%', marginTop: '-15px' }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) =>
            onChange([value[0], Math.max(Number(e.target.value), value[0] + step)])
          }
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-20"
          style={{ top: '50%', marginTop: '-15px' }}
        />
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 30px;
          width: 8px;
          background-color: rgb(90, 155, 91);
          border-radius: 0;
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          height: 30px;
          width: 8px;
          background-color: rgb(36, 63, 90);
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