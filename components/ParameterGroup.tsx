import React, { useState } from 'react';

interface ParameterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ParameterGroup: React.FC<ParameterGroupProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-900/50 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-start font-bold text-cyan-400 hover:bg-gray-700/50 rounded-t-lg transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 space-y-4 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default ParameterGroup;