import React from 'react';

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number; description?: string }[];
  // FIX: Add optional disabled prop to allow the select input to be disabled, resolving a TypeScript error.
  disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options, disabled = false }) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {options.map(option => (
          <option key={String(option.value)} value={option.value} title={option.description}>{option.label}</option>
        ))}
      </select>
       {selectedOption?.description && <p className="text-xs text-gray-500 mt-1 truncate" title={selectedOption.description}>{selectedOption.description}</p>}
    </div>
  );
};

export default SelectInput;
