
import React, { useState } from 'react';
import type { OltDevice, OntDevice, User } from '../types';
import DeviceEditModal from './DeviceEditModal';
import ImportExport from './ImportExport';
import UserManagement from './UserManagement';

interface AdminPanelProps {
  currentUser: User;
  oltDevices: OltDevice[];
  ontDevices: OntDevice[];
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onUpdate: (type: 'olt' | 'ont', device: OltDevice | OntDevice) => void;
  onAdd: (type: 'olt' | 'ont', device: OltDevice | OntDevice) => void;
  onDelete: (type: 'olt' | 'ont', deviceId: string) => void;
  onCatalogImport: (data: { olts: OltDevice[], onts: OntDevice[] }) => void;
}

type ActiveTab = 'devices' | 'users';

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, oltDevices, ontDevices, users, setUsers, onUpdate, onAdd, onDelete, onCatalogImport }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<OltDevice | OntDevice | null>(null);
  const [deviceType, setDeviceType] = useState<'olt' | 'ont'>('olt');
  const [activeTab, setActiveTab] = useState<ActiveTab>('devices');

  const isReadonly = currentUser.role === 'readonly_admin';

  const handleEdit = (device: OltDevice | OntDevice, type: 'olt' | 'ont') => {
    if (isReadonly) return;
    setEditingDevice(device);
    setDeviceType(type);
    setModalOpen(true);
  };
  
  const handleAddNew = (type: 'olt' | 'ont') => {
    if (isReadonly) return;
    setEditingDevice(null);
    setDeviceType(type);
    setModalOpen(true);
  };

  const handleSave = (device: OltDevice | OntDevice) => {
    if (isReadonly) return;
    if (editingDevice) {
      onUpdate(deviceType, device);
    } else {
      onAdd(deviceType, { ...device, id: crypto.randomUUID() });
    }
    setModalOpen(false);
  };

  const handleDelete = (type: 'olt' | 'ont', deviceId: string) => {
    if (isReadonly) return;
    if (window.confirm('Are you sure you want to delete this device?')) {
        onDelete(type, deviceId);
    }
  }

  const renderOltTable = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">OLT Devices</h2>
        {!isReadonly && <button onClick={() => handleAddNew('olt')} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Add New OLT
        </button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Model</th>
              <th scope="col" className="px-6 py-3">Technology</th>
              <th scope="col" className="px-6 py-3">Uplink Ports</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {oltDevices.map(device => (
              <tr key={device.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{device.model}</th>
                <td className="px-6 py-4">{device.technology}</td>
                <td className="px-6 py-4">{device.uplinkPorts.map(p => `${p.count}x ${p.type}`).join(', ')}</td>
                <td className="px-6 py-4 truncate max-w-xs">{device.description}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(device, 'olt')} className={`font-medium ${isReadonly ? 'text-gray-500 cursor-not-allowed' : 'text-cyan-400 hover:underline'}`}>Edit</button>
                  <button onClick={() => handleDelete('olt', device.id)} className={`font-medium ${isReadonly ? 'text-gray-500 cursor-not-allowed' : 'text-red-500 hover:underline'}`}>Delete</button>
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
         {!isReadonly && <button onClick={() => handleAddNew('ont')} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Add New ONT
        </button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Model</th>
              <th scope="col" className="px-6 py-3">Technology</th>
              <th scope="col" className="px-6 py-3">Ports</th>
              <th scope="col" className="px-6 py-3">Wi-Fi</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {ontDevices.map(device => (
              <tr key={device.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{device.model}</th>
                <td className="px-6 py-4">{device.technology}</td>
                <td className="px-6 py-4">
                    {device.ethernetPorts.map(p => `${p.count}x ${p.type}`).join(', ')}
                    {device.fxsPorts > 0 && `, ${device.fxsPorts}x FXS`}
                </td>
                <td className="px-6 py-4">{device.wifi ? `${device.wifi.standard} (${device.wifi.bands})` : 'N/A'}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(device, 'ont')} className={`font-medium ${isReadonly ? 'text-gray-500 cursor-not-allowed' : 'text-cyan-400 hover:underline'}`}>Edit</button>
                  <button onClick={() => handleDelete('ont', device.id)} className={`font-medium ${isReadonly ? 'text-gray-500 cursor-not-allowed' : 'text-red-500 hover:underline'}`}>Delete</button>
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
      <div className="flex space-x-2 border-b-2 border-gray-700">
        <button onClick={() => setActiveTab('devices')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'devices' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>
          Device Management
        </button>
        {currentUser.role === 'admin' && (
           <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'users' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>
            User Management
          </button>
        )}
      </div>

      {activeTab === 'devices' && (
        <div className="space-y-6">
          <ImportExport
            oltDevices={oltDevices}
            ontDevices={ontDevices}
            onImport={onCatalogImport}
            disabled={isReadonly}
          />
          {renderOltTable()}
          {renderOntTable()}
        </div>
      )}
      
      {activeTab === 'users' && currentUser.role === 'admin' && (
          <UserManagement users={users} setUsers={setUsers} />
      )}

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
