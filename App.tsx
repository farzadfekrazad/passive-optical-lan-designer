
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PolDesignParameters, initialParameters, OltDevice, OntDevice, User } from './types';
import Header from './components/Header';
import ParameterPanel from './components/ParameterPanel';
import VisualizationPanel from './components/VisualizationPanel';
import AdminPanel from './components/AdminPanel';
import BillOfMaterials from './components/BillOfMaterials';
import AuthView from './views/AuthView';
import { authService } from './auth/authService';
import { useI18n } from './contexts/I18nContext';

const App: React.FC = () => {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [oltDevices, setOltDevices] = useState<OltDevice[]>([]);
  const [ontDevices, setOntDevices] = useState<OntDevice[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [parameters, setParameters] = useState<PolDesignParameters | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [devicesRes, usersRes] = await Promise.all([
        fetch('/api/devices', { headers: authService.getAuthHeaders() }),
        authService.getCurrentUser()?.role === 'admin' 
            ? fetch('/api/users', { headers: authService.getAuthHeaders() })
            : Promise.resolve(null)
      ]);

      if (devicesRes.status === 401 || (usersRes && usersRes.status === 401)) {
        handleLogout();
        return;
      }
      
      const devicesData = await devicesRes.json();
      setOltDevices(devicesData.olts);
      setOntDevices(devicesData.onts);

      if (usersRes) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
      // Initialize parameters after devices are loaded
      const defaultOlt = devicesData.olts.find((o: OltDevice) => o.id === initialParameters.oltId) || devicesData.olts[0];
      if (defaultOlt) {
          const compatibleOnts = devicesData.onts.filter((ont: OntDevice) => ont.technology === defaultOlt.technology);
          const defaultOnt = compatibleOnts.find((o: OntDevice) => o.id === initialParameters.ontId) || compatibleOnts[0] || devicesData.onts[0];
          const defaultSfp = defaultOlt?.sfpOptions[0]?.name || '';
          
          setParameters({
            ...initialParameters,
            oltId: defaultOlt.id,
            ontId: defaultOnt.id,
            sfpSelection: defaultSfp,
            oltTxPower: defaultOlt?.sfpOptions[0]?.txPower || 0,
            ponPorts: defaultOlt?.ponPorts || 0,
            ontRxSensitivity: defaultOnt?.rxSensitivity || 0,
          });
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
        setIsLoading(false);
    }
  }, [user]);


  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdminPanelOpen(false);
    setOltDevices([]);
    setOntDevices([]);
    setUsers([]);
  };

  const handleParameterChange = useCallback((key: keyof PolDesignParameters, value: any) => {
    if (!parameters) return;
    setParameters(prevParams => {
        if (!prevParams) return null;
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
  }, [oltDevices, ontDevices, parameters]);

  const handleDeviceUpdate = async (type: 'olt' | 'ont', device: OltDevice | OntDevice) => {
    const res = await fetch(`/api/devices/${type}s/${device.id}`, {
        method: 'PUT',
        headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
    });
    if (res.ok) {
        const updatedDevice = await res.json();
        if (type === 'olt') {
          setOltDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
        } else {
          setOntDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
        }
    }
  };

  const handleDeviceAdd = async (type: 'olt' | 'ont', device: Omit<OltDevice, 'id'> | Omit<OntDevice, 'id'>) => {
    const res = await fetch(`/api/devices/${type}s`, {
        method: 'POST',
        headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
    });
    if (res.ok) {
        const newDevice = await res.json();
        if (type === 'olt') {
          setOltDevices(prev => [...prev, newDevice]);
        } else {
          setOntDevices(prev => [...prev, newDevice]);
        }
    }
  };

  const handleDeviceDelete = async (type: 'olt' | 'ont', deviceId: string) => {
    const res = await fetch(`/api/devices/${type}s/${deviceId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
    });

    if (res.ok) {
        if (type === 'olt') {
          const remainingOlts = oltDevices.filter(d => d.id !== deviceId);
          setOltDevices(remainingOlts);
          if (parameters && parameters.oltId === deviceId) {
            const fallbackOlt = remainingOlts[0] || null;
            handleParameterChange('oltId', fallbackOlt?.id || '');
          }
        } else {
          const remainingOnts = ontDevices.filter(d => d.id !== deviceId);
          setOntDevices(remainingOnts);
          if (parameters && parameters.ontId === deviceId) {
             const selectedOlt = oltDevices.find(olt => olt.id === parameters.oltId);
             const compatibleFallbackOnt = remainingOnts.find(o => o.technology === selectedOlt?.technology) || null;
             handleParameterChange('ontId', compatibleFallbackOnt?.id || '');
          }
        }
    }
  };
  
  const handleCatalogImport = async (data: { olts: OltDevice[], onts: OntDevice[] }) => {
    try {
        const res = await fetch('/api/devices/catalog', {
            method: 'POST',
            headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to import catalog');
        
        const importedData = await res.json();
        setOltDevices(importedData.olts);
        setOntDevices(importedData.onts);
        alert(t('importExport.importSuccess'));
    } catch (error) {
        console.error(error);
        alert(t('importExport.importError', { error: (error as Error).message }));
    }
  };

  const selectedOlt = useMemo(() => oltDevices.find(o => o.id === parameters?.oltId), [oltDevices, parameters?.oltId]);
  const selectedOnt = useMemo(() => ontDevices.find(o => o.id === parameters?.ontId), [ontDevices, parameters?.ontId]);
  
  const compatibleOnts = useMemo(() => {
    if (!selectedOlt) return ontDevices;
    return ontDevices.filter(ont => ont.technology === selectedOlt.technology);
  }, [selectedOlt, ontDevices]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex justify-center items-center"><p>{t('app.loading')}</p></div>
  }

  if (!user) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (!parameters) {
     return <div className="min-h-screen bg-gray-900 flex justify-center items-center"><p>{t('app.loading')}</p></div>
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
