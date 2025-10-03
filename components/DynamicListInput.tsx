import React from 'react';
import { useI18n } from '../contexts/I18nContext';
// FIX: Import TranslationKeys to ensure type safety for dynamic translation keys.
import type { TranslationKeys } from '../contexts/I18nContext';

interface DynamicListInputProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: T;
  renderItem: (item: T, onChange: (field: keyof T, value: any) => void) => React.ReactNode;
}

// FIX: Specify TranslationKeys as the return type to align with the `t` function's requirements.
const getSingularKey = (label: string): TranslationKeys => {
    if (label.toLowerCase().includes("port")) {
        return "generic.port";
    }
    if (label.toLowerCase().includes("option")) {
        return "generic.option";
    }
    if (label.toLowerCase().includes("component")) {
        return "generic.component";
    }
    return "generic.item";
}


function DynamicListInput<T>({ label, items, onChange, newItem, renderItem }: DynamicListInputProps<T>) {
  const { t } = useI18n();

  const handleAddItem = () => {
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof T, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-2 p-3 bg-gray-900/50 rounded-md">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 bg-gray-700/50 p-2 rounded">
          <div className="flex-grow">
            {renderItem(item, (field, value) => handleItemChange(index, field, value))}
          </div>
          <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="p-1 text-red-400 hover:text-red-300"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddItem}
        className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
      >
        {t('modal.addItem', { item: t(getSingularKey(label)) })}
      </button>
    </div>
  );
}

export default DynamicListInput;
