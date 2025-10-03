
import React, { useState, useCallback, useMemo } from 'react';
import { PolDesignParameters, initialParameters, OltDevice, OntDevice } from './types';
import { initialOltDevices, initialOntDevices } from './data/eltexDevices';
import Header from './components/Header';
import ParameterPanel from './components/ParameterPanel';
import VisualizationPanel from './components/VisualizationPanel';
import AdminPanel from './components/AdminPanel';
import BillOfMaterials from './components/BillOfMaterials';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [oltDevices, setOltDevices] = useLocalStorage<OltDevice[]>('oltDevices', initialOltDevices);
  const [ontDevices, setOntDevices] = useLocalStorage<OntDevice[]>('ontDevices', initialOntDevices);

  const [parameters, setParameters] = useState<PolDesignParameters>(() => {
    // Ensure initial parameters are valid against stored devices
    const defaultOlt = oltDevices.find(o => o.id === initialParameters.oltId) || oltDevices[0];
    const defaultOnt = ontDevices.find(o => o.id === initialParameters.ontId) || ontDevices[0];
    const defaultSfp = defaultOlt?.sfpOptions[0]?.name || '';
    
    return {
      ...initialParameters,
      oltId: defaultOlt.id,
      ontId: defaultOnt.id,
      sfpSelection: defaultSfp,
      oltTxPower: defaultOlt?.sfpOptions[0]?.txPower || 0,
      ponPorts: defaultOlt?.ponPorts || 0,
      ontRxSensitivity: defaultOnt?.rxSensitivity || 0,
    };
  });

  const handleParameterChange = useCallback((key: keyof PolDesignParameters, value: any) => {
    setParameters(prevParams => {
        let newParams = { ...prevParams, [key]: value };

        if (key === 'oltId') {
            const selectedOlt = oltDevices.find(olt => olt.id === value);
            if (selectedOlt) {
                const firstSfp = selectedOlt.sfpOptions[0];
                newParams.ponPorts = selectedOlt.ponPorts;
                newParams.sfpSelection = firstSfp?.name || '';
                newParams.oltTxPower = firstSfp?.txPower || 0;
            }
        }
        
        if (key === 'sfpSelection') {
             const selectedOlt = oltDevices.find(olt => olt.id === newParams.oltId);
             const selectedSfp = selectedOlt?.sfpOptions.find(sfp => sfp.name === value);
             if (selectedSfp) {
                newParams.oltTxPower = selectedSfp.txPower;
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
        const fallbackOlt = oltDevices.find(d => d.id !== deviceId) || null;
        handleParameterChange('oltId', fallbackOlt?.id || '');
      }
    } else {
      setOntDevices(prev => prev.filter(d => d.id !== deviceId));
      if (parameters.ontId === deviceId) {
         const fallbackOnt = ontDevices.find(d => d.id !== deviceId) || null;
         handleParameterChange('ontId', fallbackOnt?.id || '');
      }
    }
  };

  const selectedOlt = useMemo(() => oltDevices.find(o => o.id === parameters.oltId), [oltDevices, parameters.oltId]);
  const selectedOnt = useMemo(() => ontDevices.find(o => o.id === parameters.ontId), [ontDevices, parameters.ontId]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Header onAdminClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)} isAdminOpen={isAdminPanelOpen} />
      <main className="flex-grow p-4 max-w-[1920px] mx-auto w-full">
        {isAdminPanelOpen ? (
          <AdminPanel 
            oltDevices={oltDevices}
            ontDevices={ontDevices}
            onAdd={handleDeviceAdd}
            onUpdate={handleDeviceUpdate}
            onDelete={handleDeviceDelete}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
            <div className="xl:col-span-3">
              <ParameterPanel 
                parameters={parameters} 
                onChange={handleParameterChange}
                oltDevices={oltDevices}
                ontDevices={ontDevices}
                selectedOlt={selectedOlt}
                selectedOnt={selectedOnt}
              />
            </div>
            <div className="xl:col-span-6">
              <VisualizationPanel parameters={parameters} selectedOlt={selectedOlt} />
            </div>
            <div className="xl:col-span-3">
               <BillOfMaterials 
                  parameters={parameters}
                  selectedOlt={selectedOlt}
                  selectedOnt={selectedOnt}
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
