
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PolDesignParameters, initialParameters, OltDevice, OntDevice, User } from './types';
import { initialOltDevices, initialOntDevices } from './data/eltexDevices';
import Header from './components/Header';
import ParameterPanel from './components/ParameterPanel';
import VisualizationPanel from './components/VisualizationPanel';
import AdminPanel from './components/AdminPanel';
import BillOfMaterials from './components/BillOfMaterials';
import useLocalStorage from './hooks/useLocalStorage';
import AuthView from './views/AuthView';
import { authService } from './auth/authService';
import { useI18n } from './contexts/I18nContext';

const App: React.FC = () => {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [oltDevices, setOltDevices] = useLocalStorage<OltDevice[]>('oltDevices', initialOltDevices);
  const [ontDevices, setOntDevices] = useLocalStorage<OntDevice[]>('ontDevices', initialOntDevices);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);

  const [parameters, setParameters] = useState<PolDesignParameters>(() => {
    const defaultOlt = oltDevices.find(o => o.id === initialParameters.oltId) || oltDevices[0];
    const compatibleOnts = ontDevices.filter(ont => ont.technology === defaultOlt.technology);
    const defaultOnt = compatibleOnts.find(o => o.id === initialParameters.ontId) || compatibleOnts[0] || ontDevices[0];
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
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (!currentUser || currentUser.role === 'user') {
      setIsAdminPanelOpen(false);
    }
  }, []);


  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdminPanelOpen(false);
  };

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

                const compatibleOnts = ontDevices.filter(ont => ont.technology === selectedOlt.technology);
                const currentOnt = ontDevices.find(ont => ont.id === newParams.ontId);

                if (!currentOnt || currentOnt.technology !== selectedOlt.technology) {
                    const newOnt = compatibleOnts[0];
                    if (newOnt) {
                        newParams.ontId = newOnt.id;
                        newParams.ontRxSensitivity = newOnt.rxSensitivity;
                    } else {
                        newParams.ontId = '';
                        newParams.ontRxSensitivity = 0;
                    }
                }
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
      const remainingOlts = oltDevices.filter(d => d.id !== deviceId);
      setOltDevices(remainingOlts);
      if (parameters.oltId === deviceId) {
        const fallbackOlt = remainingOlts[0] || null;
        handleParameterChange('oltId', fallbackOlt?.id || '');
      }
    } else {
      const remainingOnts = ontDevices.filter(d => d.id !== deviceId);
      setOntDevices(remainingOnts);
      if (parameters.ontId === deviceId) {
         const selectedOlt = oltDevices.find(olt => olt.id === parameters.oltId);
         const compatibleFallbackOnt = remainingOnts.find(o => o.technology === selectedOlt?.technology) || null;
         handleParameterChange('ontId', compatibleFallbackOnt?.id || '');
      }
    }
  };
  
  const handleCatalogImport = (data: { olts: OltDevice[], onts: OntDevice[] }) => {
    setOltDevices(data.olts);
    setOntDevices(data.onts);
    alert(t('importExport.importSuccess'));
  };

  const selectedOlt = useMemo(() => oltDevices.find(o => o.id === parameters.oltId), [oltDevices, parameters.oltId]);
  const selectedOnt = useMemo(() => ontDevices.find(o => o.id === parameters.ontId), [ontDevices, parameters.ontId]);
  
  const compatibleOnts = useMemo(() => {
    if (!selectedOlt) return ontDevices;
    return ontDevices.filter(ont => ont.technology === selectedOlt.technology);
  }, [selectedOlt, ontDevices]);

  if (!user) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onAdminClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)} 
        isAdminOpen={isAdminPanelOpen} 
      />
      <main className="flex-grow p-4 max-w-[1920px] mx-auto w-full">
        {isAdminPanelOpen ? (
          <AdminPanel 
            currentUser={user}
            oltDevices={oltDevices}
            ontDevices={ontDevices}
            users={users}
            setUsers={setUsers}
            onAdd={handleDeviceAdd}
            onUpdate={handleDeviceUpdate}
            onDelete={handleDeviceDelete}
            onCatalogImport={handleCatalogImport}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
            <div className="xl:col-span-3">
              <ParameterPanel 
                parameters={parameters} 
                onChange={handleParameterChange}
                oltDevices={oltDevices}
                ontDevices={compatibleOnts}
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