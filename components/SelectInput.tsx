
import React from 'react';

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number; description?: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options }) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {options.map(option => (
          <option key={String(option.value)} value={option.value} title={option.description}>{option.label}</option>
        ))}
      </select>
       {selectedOption?.description && <p className="text-xs text-gray-500 mt-1 truncate">{selectedOption.description}</p>}
    </div>
  );
};

export default SelectInput;
