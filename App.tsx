
import React, { useState, useCallback } from 'react';
import { PolDesignParameters, initialParameters, OltDevice, OntDevice } from './types';
import { initialOltDevices, initialOntDevices } from './data/eltexDevices';
import Header from './components/Header';
import ParameterPanel from './components/ParameterPanel';
import VisualizationPanel from './components/VisualizationPanel';
import AdminPanel from './components/AdminPanel';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [parameters, setParameters] = useState<PolDesignParameters>(initialParameters);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [oltDevices, setOltDevices] = useLocalStorage<OltDevice[]>('oltDevices', initialOltDevices);
  const [ontDevices, setOntDevices] = useLocalStorage<OntDevice[]>('ontDevices', initialOntDevices);

  const handleParameterChange = useCallback((key: keyof PolDesignParameters, value: any) => {
    setParameters(prevParams => {
        let newParams = { ...prevParams, [key]: value };

        if (key === 'oltId') {
            const selectedOlt = oltDevices.find(olt => olt.id === value);
            if (selectedOlt) {
                newParams.ponPorts = selectedOlt.ponPorts;
                newParams.oltTxPower = selectedOlt.txPower;
            }
        }

        if (key === 'ontId') {
            const selectedOnt = ontDevices.find(ont => ont.id === value);
            if (selectedOnt) {
                newParams.ontRxSensitivity = selectedOnt.rxSensitivity;
            }
        }
        
        if (key === 'splitRatio') {
            const maxOnts = parseInt(value.split(':')[1]);
            if (newParams.ontsPerPonPort > maxOnts) {
                newParams.ontsPerPonPort = maxOnts;
            }
        }
        
        return newParams;
    });
  }, [oltDevices, ontDevices]);

  const handleDeviceUpdate = (type: 'olt' | 'ont', device: OltDevice | OntDevice) => {
    if (type === 'olt') {
      setOltDevices(prev => prev.map(d => d.id === device.id ? device as OltDevice : d));
    } else {
      setOntDevices(prev => prev.map(d => d.id === device.id ? device as OntDevice : d));
    }
  };

  const handleDeviceAdd = (type: 'olt' | 'ont', device: OltDevice | OntDevice) => {
    if (type === 'olt') {
      setOltDevices(prev => [...prev, device as OltDevice]);
    } else {
      setOntDevices(prev => [...prev, device as OntDevice]);
    }
  };

  const handleDeviceDelete = (type: 'olt' | 'ont', deviceId: string) => {
    if (type === 'olt') {
      setOltDevices(prev => prev.filter(d => d.id !== deviceId));
      if (parameters.oltId === deviceId) {
        // Reset to a valid device if the deleted one was selected
        const newOlt = oltDevices.find(d => d.id !== deviceId);
        if(newOlt) handleParameterChange('oltId', newOlt.id);
      }
    } else {
      setOntDevices(prev => prev.filter(d => d.id !== deviceId));
      if (parameters.ontId === deviceId) {
         const newOnt = ontDevices.find(d => d.id !== deviceId);
         if(newOnt) handleParameterChange('ontId', newOnt.id);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header onAdminClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)} isAdminOpen={isAdminPanelOpen} />
      <main className="p-4 max-w-[1920px] mx-auto">
        {isAdminPanelOpen ? (
          <AdminPanel 
            oltDevices={oltDevices}
            ontDevices={ontDevices}
            onAdd={handleDeviceAdd}
            onUpdate={handleDeviceUpdate}
            onDelete={handleDeviceDelete}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3 xl:w-1/4">
              <ParameterPanel 
                parameters={parameters} 
                onChange={handleParameterChange}
                oltDevices={oltDevices}
                ontDevices={ontDevices}
              />
            </div>
            <div className="flex-1 lg:w-2/3 xl:w-3/4">
              <VisualizationPanel parameters={parameters} oltDevices={oltDevices} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
