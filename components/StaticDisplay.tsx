
import React from 'react';

interface StaticDisplayProps {
  label: string;
  value: string | number;
}

const StaticDisplay: React.FC<StaticDisplayProps> = ({ label, value }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <span className="text-sm font-semibold text-cyan-300 bg-gray-700 px-3 py-1 rounded">{value}</span>
      </div>
    </div>
  );
};

export default StaticDisplay;
