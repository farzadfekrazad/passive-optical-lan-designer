
import React, { useState } from 'react';
import type { OltDevice, OntDevice } from '../types';
import DeviceEditModal from './DeviceEditModal';

interface AdminPanelProps {
  oltDevices: OltDevice[];
  ontDevices: OntDevice[];
  onUpdate: (type: 'olt' | 'ont', device: OltDevice | OntDevice) => void;
  onAdd: (type: 'olt' | 'ont', device: OltDevice | OntDevice) => void;
  onDelete: (type: 'olt' | 'ont', deviceId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ oltDevices, ontDevices, onUpdate, onAdd, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<OltDevice | OntDevice | null>(null);
  const [deviceType, setDeviceType] = useState<'olt' | 'ont'>('olt');

  const handleEdit = (device: OltDevice | OntDevice, type: 'olt' | 'ont') => {
    setEditingDevice(device);
    setDeviceType(type);
    setModalOpen(true);
  };
  
  const handleAddNew = (type: 'olt' | 'ont') => {
    setEditingDevice(null);
    setDeviceType(type);
    setModalOpen(true);
  };

  const handleSave = (device: OltDevice | OntDevice) => {
    if (editingDevice) {
      onUpdate(deviceType, device);
    } else {
      onAdd(deviceType, { ...device, id: crypto.randomUUID() });
    }
    setModalOpen(false);
  };

  const renderOltTable = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">OLT Devices</h2>
        <button onClick={() => handleAddNew('olt')} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Add New OLT
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Model</th>
              <th scope="col" className="px-6 py-3">PON Ports</th>
              <th scope="col" className="px-6 py-3">SFP Options</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {oltDevices.map(device => (
              <tr key={device.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{device.model}</th>
                <td className="px-6 py-4">{device.ponPorts}</td>
                <td className="px-6 py-4">{device.sfpOptions.map(s => `${s.name} (${s.txPower}dBm)`).join(', ')}</td>
                <td className="px-6 py-4 truncate max-w-xs">{device.description}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(device, 'olt')} className="font-medium text-cyan-400 hover:underline">Edit</button>
                  <button onClick={() => onDelete('olt', device.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderOntTable = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">ONT Devices</h2>
        <button onClick={() => handleAddNew('ont')} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Add New ONT
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Model</th>
              <th scope="col" className="px-6 py-3">Rx Sensitivity</th>
              <th scope="col" className="px-6 py-3">Ports</th>
              <th scope="col" className="px-6 py-3">Wi-Fi</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {ontDevices.map(device => (
              <tr key={device.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{device.model}</th>
                <td className="px-6 py-4">{device.rxSensitivity.toFixed(1)} dBm</td>
                <td className="px-6 py-4">
                    {device.ethernetPorts.map(p => `${p.count}x ${p.type}`).join(', ')}
                    {device.fxsPorts > 0 && `, ${device.fxsPorts}x FXS`}
                </td>
                <td className="px-6 py-4">{device.wifi ? `${device.wifi.standard} (${device.wifi.bands})` : 'N/A'}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(device, 'ont')} className="font-medium text-cyan-400 hover:underline">Edit</button>
                  <button onClick={() => onDelete('ont', device.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  return (
    <div className="space-y-6">
      {renderOltTable()}
      {renderOntTable()}
      {modalOpen && (
        <DeviceEditModal
          device={editingDevice}
          type={deviceType}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
