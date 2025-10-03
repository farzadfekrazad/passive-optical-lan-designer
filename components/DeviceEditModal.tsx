import React, { useState } from 'react';
import type { OltDevice, OntDevice, OltSfpOption, OltComponent, OntEthernetPort, PonTechnology, UplinkPort } from '../types';
import DynamicListInput from './DynamicListInput';
import { useI18n } from '../contexts/I18nContext';

interface DeviceEditModalProps {
  device: OltDevice | OntDevice | null;
  type: 'olt' | 'ont';
  onSave: (device: OltDevice | OntDevice) => void;
  onClose: () => void;
}

const emptyOlt: Omit<OltDevice, 'id'> = { model: '', description: '', technology: 'GPON', ponPorts: 8, uplinkPorts: [{type: '10G SFP+', count: 4}], sfpOptions: [{name: 'GPON SFP C+', txPower: 5.0}], components: [] };
const emptyOnt: Omit<OntDevice, 'id'> = { model: '', description: '', technology: 'GPON', rxSensitivity: -28, ethernetPorts: [{type: '10/100/1000Base-T', count: 1}], fxsPorts: 0, wifi: null };

const DeviceEditModal: React.FC<DeviceEditModalProps> = ({ device, type, onSave, onClose }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Omit<OltDevice, 'id'> | Omit<OntDevice, 'id'>>(() => {
    if (device) return device;
    return type === 'olt' ? emptyOlt : emptyOnt;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type: inputType, checked } = e.target as HTMLInputElement;
    
    if (name === 'hasWifi') {
        const ontData = formData as Omit<OntDevice, 'id'>;
        setFormData({
            ...ontData,
            wifi: checked ? { standard: '802.11ax', bands: '2.4/5GHz' } : null,
        });
        return;
    }
    
    if (name.startsWith('wifi.')) {
        const field = name.split('.')[1];
        const ontData = formData as Omit<OntDevice, 'id'>;
        setFormData({
            ...ontData,
            wifi: ontData.wifi ? { ...ontData.wifi, [field]: value } : null,
        });
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as OltDevice | OntDevice);
  };

  const title = device ? t('modal.edit', { type: type.toUpperCase() }) : t('modal.add', { type: type.toUpperCase() });
  
  const technologyOptions: {label: string, value: PonTechnology}[] = [
      { label: 'GPON', value: 'GPON' },
      { label: 'XGS-PON', value: 'XGS-PON' }
  ];

  const renderOltFields = () => {
    const oltData = formData as Omit<OltDevice, 'id'>;
    return <>
      <div>
        <label htmlFor="ponPorts" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.ponPorts')}</label>
        <input type="number" name="ponPorts" id="ponPorts" value={oltData.ponPorts} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
       <DynamicListInput<UplinkPort>
        label={t('modal.uplinkPorts')}
        items={oltData.uplinkPorts}
        onChange={(newUplinks) => setFormData(p => ({...(p as OltDevice), uplinkPorts: newUplinks}))}
        newItem={{ type: '10G SFP+', count: 2 }}
        renderItem={(item, onChange) => (
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={item.type} onChange={e => onChange('type', e.target.value)} placeholder={t('modal.uplinkTypePlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
            <input type="number" step="1" value={item.count} onChange={e => onChange('count', parseInt(e.target.value))} placeholder={t('modal.uplinkCountPlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
          </div>
        )}
      />
      <DynamicListInput<OltSfpOption>
        label={t('modal.sfpOptions')}
        items={oltData.sfpOptions}
        onChange={(newSfps) => setFormData(p => ({...(p as OltDevice), sfpOptions: newSfps}))}
        newItem={{ name: 'SFP Type', txPower: 5.0 }}
        renderItem={(item, onChange) => (
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={item.name} onChange={e => onChange('name', e.target.value)} placeholder={t('modal.sfpNamePlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
            <input type="number" step="0.1" value={item.txPower} onChange={e => onChange('txPower', parseFloat(e.target.value))} placeholder={t('modal.sfpTxPowerPlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
          </div>
        )}
      />
      <DynamicListInput<OltComponent>
        label={t('modal.chassisComponents')}
        items={oltData.components}
        onChange={(newComps) => setFormData(p => ({...(p as OltDevice), components: newComps}))}
        newItem={{ name: 'Component Name', quantity: 1 }}
        renderItem={(item, onChange) => (
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={item.name} onChange={e => onChange('name', e.target.value)} placeholder={t('modal.componentNamePlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
            <input type="number" value={item.quantity} onChange={e => onChange('quantity', parseInt(e.target.value))} placeholder={t('modal.componentQuantityPlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
          </div>
        )}
      />
    </>;
  };
  
  const renderOntFields = () => {
    const ontData = formData as Omit<OntDevice, 'id'>;
    return <>
        <div>
            <label htmlFor="rxSensitivity" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.rxSensitivity')}</label>
            <input type="number" step="0.1" name="rxSensitivity" id="rxSensitivity" value={ontData.rxSensitivity} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
        </div>
         <div>
            <label htmlFor="fxsPorts" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.fxsPorts')}</label>
            <input type="number" name="fxsPorts" id="fxsPorts" value={ontData.fxsPorts} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
        </div>
        <DynamicListInput<OntEthernetPort>
            label={t('modal.ethernetPorts')}
            items={ontData.ethernetPorts}
            onChange={(newPorts) => setFormData(p => ({...(p as OntDevice), ethernetPorts: newPorts}))}
            newItem={{ type: '10/100/1000Base-T', count: 1 }}
            renderItem={(item, onChange) => (
            <div className="grid grid-cols-2 gap-2">
                <input type="text" value={item.type} onChange={e => onChange('type', e.target.value)} placeholder={t('modal.portTypePlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
                <input type="number" value={item.count} onChange={e => onChange('count', parseInt(e.target.value))} placeholder={t('modal.portCountPlaceholder')} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white" />
            </div>
            )}
        />
        <div className="space-y-2 p-3 bg-gray-900/50 rounded-md">
            <div className="flex items-center">
                <input type="checkbox" name="hasWifi" id="hasWifi" checked={!!ontData.wifi} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 ltr:mr-2 rtl:ml-2" />
                <label htmlFor="hasWifi" className="block text-sm text-gray-300">{t('modal.hasWifi')}</label>
            </div>
            {ontData.wifi && (
                <div className="grid grid-cols-2 gap-2 ltr:pl-6 rtl:pr-6">
                    <div>
                        <label className="text-xs text-gray-400">{t('modal.wifiStandard')}</label>
                        <input type="text" name="wifi.standard" value={ontData.wifi.standard} onChange={handleChange} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">{t('modal.wifiBands')}</label>
                         <input type="text" name="wifi.bands" value={ontData.wifi.bands} onChange={handleChange} className="w-full bg-gray-600 border border-gray-500 rounded-md py-1 px-2 text-white text-sm" />
                    </div>
                </div>
            )}
        </div>
    </>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.model')}</label>
            <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
           <div>
            <label htmlFor="technology" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.technology')}</label>
            <select name="technology" id="technology" value={formData.technology} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {technologyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">{t('modal.description')}</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          
          {type === 'olt' ? renderOltFields() : renderOntFields()}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors">{t('modal.cancel')}</button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">{t('modal.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceEditModal;