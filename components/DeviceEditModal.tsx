
import React, { useState, useEffect } from 'react';
import type { OltDevice, OntDevice } from '../types';

interface DeviceEditModalProps {
  device: OltDevice | OntDevice | null;
  type: 'olt' | 'ont';
  onSave: (device: OltDevice | OntDevice) => void;
  onClose: () => void;
}

const emptyOlt: Omit<OltDevice, 'id'> = { model: '', description: '', ponPorts: 8, txPower: 3.5 };
const emptyOnt: Omit<OntDevice, 'id'> = { model: '', description: '', rxSensitivity: -28 };

const DeviceEditModal: React.FC<DeviceEditModalProps> = ({ device, type, onSave, onClose }) => {
  const [formData, setFormData] = useState(device || (type === 'olt' ? emptyOlt : emptyOnt));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ponPorts' || name === 'txPower' || name === 'rxSensitivity' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as OltDevice | OntDevice);
  };

  const title = device ? `Edit ${type.toUpperCase()}` : `Add New ${type.toUpperCase()}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-400 mb-1">Model</label>
            <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          {type === 'olt' && (
            <>
              <div>
                <label htmlFor="ponPorts" className="block text-sm font-medium text-gray-400 mb-1">PON Ports</label>
                <input type="number" name="ponPorts" id="ponPorts" value={(formData as OltDevice).ponPorts} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label htmlFor="txPower" className="block text-sm font-medium text-gray-400 mb-1">Transmit Power (dBm)</label>
                <input type="number" step="0.1" name="txPower" id="txPower" value={(formData as OltDevice).txPower} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </>
          )}
          {type === 'ont' && (
            <div>
              <label htmlFor="rxSensitivity" className="block text-sm font-medium text-gray-400 mb-1">Receiver Sensitivity (dBm)</label>
              <input type="number" step="0.1" name="rxSensitivity" id="rxSensitivity" value={(formData as OntDevice).rxSensitivity} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceEditModal;
