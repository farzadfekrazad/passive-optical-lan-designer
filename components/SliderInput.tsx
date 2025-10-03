
import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange, min, max, step }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <span className="text-sm font-semibold text-cyan-300 bg-gray-700 px-2 py-0.5 rounded">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
           background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((value - min) / (max - min)) * 100}%, #4a5568 ${((value - min) / (max - min)) * 100}%, #4a5568 100%)`
        }}
      />
    </div>
  );
};

export default SliderInput;
